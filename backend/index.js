const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3009;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// File paths
const CHAT_IDS_PATH = path.join(__dirname, 'data', 'chatIds.json');
const CHATS_PATH = path.join(__dirname, 'data', 'chats.json');

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`\n🌐 ${req.method} ${req.path} - ${new Date().toLocaleTimeString()}`);
  next();
});

// Helper function to read chat IDs
const readChatIds = () => {
  try {
    if (fs.existsSync(CHAT_IDS_PATH)) {
      const data = fs.readFileSync(CHAT_IDS_PATH, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading chat IDs:', error);
    return [];
  }
};

// Helper function to write chat IDs
const writeChatIds = (chatIds) => {
  try {
    fs.writeFileSync(CHAT_IDS_PATH, JSON.stringify(chatIds, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing chat IDs:', error);
    return false;
  }
};

// Helper function to add new session ID
const addSessionId = (sessionId) => {
  const chatIds = readChatIds();
  const newEntry = {
    chatId: sessionId,
    timestamp: new Date().toISOString(),
    createdAt: new Date().toLocaleString()
  };
  
  chatIds.push(newEntry);
  writeChatIds(chatIds);
  return newEntry;
};

// Helper function to read chat history
const readChatHistory = () => {
  try {
    if (fs.existsSync(CHATS_PATH)) {
      const data = fs.readFileSync(CHATS_PATH, 'utf8');
      return JSON.parse(data);
    }
    return {};
  } catch (error) {
    console.error('Error reading chat history:', error);
    return {};
  }
};

// Helper function to write chat history
const writeChatHistory = (chatHistory) => {
  try {
    fs.writeFileSync(CHATS_PATH, JSON.stringify(chatHistory, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing chat history:', error);
    return false;
  }
};

// Helper function to save message to chat history
const saveMessage = (sessionId, message) => {
  const chatHistory = readChatHistory();
  
  if (!chatHistory[sessionId]) {
    chatHistory[sessionId] = {
      sessionId: sessionId,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      messages: []
    };
  }
  
  chatHistory[sessionId].messages.push(message);
  chatHistory[sessionId].lastUpdated = new Date().toISOString();
  
  writeChatHistory(chatHistory);
};

// OpenAI-powered chatbot response logic
const getBotResponse = async (userMessage, sessionId) => {
  try {
    // Get chat history for context
    const chatHistory = readChatHistory();
    const sessionHistory = chatHistory[sessionId]?.messages || [];
    
    // Build conversation context (last 10 messages for context)
    const recentMessages = sessionHistory.slice(-10);
    const messages = [
      {
        role: "system",
        content: "You are an AI Sales Representative for a Solar System selling company. You are knowledgeable about solar panels, renewable energy solutions, installation processes, cost savings, government incentives, and environmental benefits. Your goal is to help potential customers understand the benefits of solar energy and guide them towards making an informed decision about solar system installation. Be friendly, professional, and focus on the customer's energy needs, cost savings, and environmental impact. Always provide helpful information about solar solutions while being consultative rather than pushy.Act as a sales person of solar system selling company called NegGenAi-Solar. Provide simple and short answers only. "
      }
    ];

    // Add recent conversation history
    recentMessages.forEach(msg => {
      messages.push({
        role: (msg.sender === 'user' || msg.sender === 'admin') ? 'user' : 'assistant',
        content: msg.text || msg.content
      });
    });

    // Add current user message
    messages.push({
      role: "user",
      content: userMessage
    });

    console.log(`🤖 Calling OpenAI API with ${messages.length} messages`);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const botResponse = completion.choices[0]?.message?.content || "I apologize, but I'm having trouble generating a response right now. Please try again.";
    
    console.log(`✅ OpenAI response received: ${botResponse.length} characters`);
    return botResponse;

  } catch (error) {
    console.error('❌ OpenAI API Error:', error.message);
    
    // Return error message instead of fallback responses
    throw new Error('Chatbot server is not working. OpenAI API is unavailable.');
  }
};

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Chatbot Backend Server is running!',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId, sender } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message is required and must be a string',
        status: 'error'
      });
    }

    // Log the incoming message with session ID
    if (sessionId) {
      console.log(`📨 Message: "${message}" | Session: ${sessionId}`);
    } else {
      console.log(`📨 Message: "${message}" | ⚠️  No session ID`);
    }
    
    // Log session ID for debugging and store it
    if (sessionId) {
      // Check if this is a new session (first message)
      const chatIds = readChatIds();
      const existingSession = chatIds.find(entry => entry.chatId === sessionId);
      
      if (!existingSession) {
        // Add new session ID to the file
        const newEntry = addSessionId(sessionId);
        console.log(`🆕 New session created: ${sessionId} at ${newEntry.createdAt}`);
      } else {
        console.log(`♻️  Existing session: ${sessionId}`);
      }

      // Save user/admin message to chat history
      const userMessage = {
        id: Date.now(),
        text: message,
        sender: sender || 'user', // Use 'admin' if sender is specified
        timestamp: new Date().toISOString()
      };
      saveMessage(sessionId, userMessage);
      console.log(`💾 ${sender || 'User'} message saved to chat history`);
    }

    // Generate bot response using OpenAI
    try {
      const botResponse = await getBotResponse(message, sessionId);
      
      // Save bot response to chat history
      if (sessionId) {
        const botMessage = {
          id: Date.now() + 1,
          text: botResponse,
          sender: 'bot',
          timestamp: new Date().toISOString()
        };
        saveMessage(sessionId, botMessage);
        console.log(`💾 Bot response saved to chat history`);
      }
      
      // Log the bot response
      console.log(`🤖 Bot response: "${botResponse}"`);
      console.log(`⏱️  Response time: ${new Date().toISOString()}`);
      console.log(`────────────────────────────────────────`);
      
      res.json({
        response: botResponse,
        status: 'success',
        timestamp: new Date().toISOString(),
        userMessage: message,
        sessionId: sessionId || null
      });
    } catch (error) {
      console.error('Error generating bot response:', error);
      
      // Check if it's an OpenAI API error
      if (error.message.includes('Chatbot server is not working')) {
        res.status(503).json({
          error: 'Chatbot server is not working. OpenAI API is unavailable.',
          message: 'The AI chatbot service is currently unavailable. Please try again later or contact support.',
          status: 'error',
          serviceUnavailable: true
        });
      } else {
        res.status(500).json({
          error: 'Failed to generate bot response',
          status: 'error'
        });
      }
    }

  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({
      error: 'Internal server error',
      status: 'error'
    });
  }
});

// Get all session IDs endpoint
app.get('/api/sessions', (req, res) => {
  try {
    const chatIds = readChatIds();
    res.json({
      sessions: chatIds,
      total: chatIds.length,
      status: 'success',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error retrieving session IDs:', error);
    res.status(500).json({
      error: 'Internal server error',
      status: 'error'
    });
  }
});

// Get chat history by session ID endpoint
app.get('/api/chat/history/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      return res.status(400).json({
        error: 'Session ID is required',
        status: 'error'
      });
    }

    const chatHistory = readChatHistory();
    const sessionData = chatHistory[sessionId];

    if (!sessionData) {
      return res.json({
        sessionId: sessionId,
        messages: [],
        status: 'success',
        message: 'No chat history found for this session'
      });
    }

    res.json({
      sessionId: sessionId,
      messages: sessionData.messages,
      createdAt: sessionData.createdAt,
      lastUpdated: sessionData.lastUpdated,
      totalMessages: sessionData.messages.length,
      status: 'success'
    });

  } catch (error) {
    console.error('Error retrieving chat history:', error);
    res.status(500).json({
      error: 'Internal server error',
      status: 'error'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🤖 Chatbot Backend Server running on port ${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   GET  / - Server status`);
  console.log(`   POST /api/chat - Send message to chatbot`);
  console.log(`   GET  /api/sessions - Get all session IDs`);
  console.log(`   GET  /api/chat/history/:sessionId - Get chat history`);
  console.log(`   GET  /api/health - Health check`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`💾 Session IDs stored in: ${CHAT_IDS_PATH}`);
  console.log(`💬 Chat history stored in: ${CHATS_PATH}`);
});

module.exports = app;
