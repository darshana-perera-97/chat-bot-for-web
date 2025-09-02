const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5060;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
const chatsFile = path.join(dataDir, 'chats.json');

async function ensureDataDirectory() {
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

async function loadChats() {
  try {
    const data = await fs.readFile(chatsFile, 'utf8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function saveChats(chats) {
  await fs.writeFile(chatsFile, JSON.stringify(chats, null, 2));
}

// Simple AI response function (you can replace this with actual AI service)
function generateAIResponse(userMessage, chatHistory) {
  const responses = [
    "That's an interesting question! Let me think about that.",
    "I understand what you're asking. Here's my perspective on that.",
    "Great question! Based on what you've shared, I'd say...",
    "I see what you mean. Let me provide some insights on that topic.",
    "That's a thoughtful point. Here's what I think about it.",
    "Thanks for sharing that with me. I'd like to add that...",
    "I appreciate you bringing that up. My view on this is...",
    "That's a good observation. From my perspective..."
  ];
  
  // Simple keyword-based responses
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! How can I help you today?";
  } else if (lowerMessage.includes('how are you')) {
    return "I'm doing well, thank you for asking! How are you doing?";
  } else if (lowerMessage.includes('weather')) {
    return "I don't have access to real-time weather data, but I'd be happy to help you with other questions!";
  } else if (lowerMessage.includes('time')) {
    return `The current time is ${new Date().toLocaleString()}. Is there anything else I can help you with?`;
  } else if (lowerMessage.includes('help')) {
    return "I'm here to help! You can ask me questions, have a conversation, or just chat. What would you like to talk about?";
  } else {
    return responses[Math.floor(Math.random() * responses.length)] + " " + userMessage;
  }
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Chatbot backend is running' });
});

// Get all chats
app.get('/api/chats', async (req, res) => {
  try {
    const chats = await loadChats();
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load chats' });
  }
});

// Get specific chat session
app.get('/api/chats/:sessionId', async (req, res) => {
  try {
    const chats = await loadChats();
    const sessionId = req.params.sessionId;
    
    if (chats[sessionId]) {
      res.json(chats[sessionId]);
    } else {
      res.status(404).json({ error: 'Chat session not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to load chat session' });
  }
});

// Create new chat session
app.post('/api/chats', async (req, res) => {
  try {
    const chats = await loadChats();
    const sessionId = uuidv4();
    const newChat = {
      sessionId,
      createdAt: new Date().toISOString(),
      messages: []
    };
    
    chats[sessionId] = newChat;
    await saveChats(chats);
    
    res.json(newChat);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create chat session' });
  }
});

// Send message to chatbot
app.post('/api/chats/:sessionId/messages', async (req, res) => {
  try {
    const { message } = req.body;
    const sessionId = req.params.sessionId;
    
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const chats = await loadChats();
    
    if (!chats[sessionId]) {
      return res.status(404).json({ error: 'Chat session not found' });
    }
    
    const userMessage = {
      id: uuidv4(),
      type: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString()
    };
    
    // Add user message
    chats[sessionId].messages.push(userMessage);
    
    // Generate AI response
    const aiResponse = generateAIResponse(message, chats[sessionId].messages);
    const aiMessage = {
      id: uuidv4(),
      type: 'ai',
      content: aiResponse,
      timestamp: new Date().toISOString()
    };
    
    // Add AI message
    chats[sessionId].messages.push(aiMessage);
    chats[sessionId].updatedAt = new Date().toISOString();
    
    await saveChats(chats);
    
    res.json({
      userMessage,
      aiMessage
    });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Initialize server
async function startServer() {
  await ensureDataDirectory();
  
  app.listen(PORT, () => {
    console.log(`Chatbot backend server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

startServer().catch(console.error);
