const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3333;

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

// Chatbot response logic
const getBotResponse = (userMessage) => {
  const message = userMessage.toLowerCase();
  
  if (message.includes('hello') || message.includes('hi')) {
    return "Hello! I'm your AI Research Assistant. I can help you with literature reviews, research methodology, academic writing, data analysis, and more. What research topic are you working on?";
  } else if (message.includes('help') || message.includes('research')) {
    return "I can assist you with various research tasks including: literature reviews, research methodology, academic writing, citation formatting, data analysis, and finding relevant sources. What specific area would you like help with?";
  } else if (message.includes('literature') || message.includes('review')) {
    return "For literature reviews, I can help you identify key themes, organize sources, and structure your review. What's your research topic or field of study?";
  } else if (message.includes('methodology') || message.includes('method')) {
    return "I can help you choose appropriate research methods, design studies, and understand different methodological approaches. What type of research are you conducting?";
  } else if (message.includes('writing') || message.includes('paper')) {
    return "I can assist with academic writing including structure, clarity, and proper citation formatting. What section of your paper are you working on?";
  } else if (message.includes('citation') || message.includes('reference')) {
    return "I can help with various citation styles (APA, MLA, Chicago, etc.) and proper referencing. Which citation style do you need help with?";
  } else if (message.includes('data') || message.includes('analysis')) {
    return "I can help you understand different data analysis methods, statistical approaches, and interpretation of results. What type of data are you working with?";
  } else if (message.includes('thank')) {
    return "You're welcome! I'm here to support your research journey. Feel free to ask me anything else about your academic work.";
  } else if (message.includes('bye') || message.includes('goodbye')) {
    return "Goodbye! Best of luck with your research. Don't hesitate to return if you need any assistance with your academic work.";
  } else if (message.includes('quantitative')) {
    return "Quantitative research involves numerical data analysis. I can help you with statistical methods, survey design, experimental design, and data interpretation. What specific quantitative method are you interested in?";
  } else if (message.includes('qualitative')) {
    return "Qualitative research focuses on understanding experiences and meanings. I can assist with interview techniques, thematic analysis, grounded theory, and case study methods. What qualitative approach are you considering?";
  } else if (message.includes('thesis') || message.includes('dissertation')) {
    return "I can help you with thesis and dissertation writing including structure, methodology selection, literature review organization, and academic writing style. What stage of your thesis are you at?";
  } else if (message.includes('journal') || message.includes('publication')) {
    return "I can guide you through the publication process including journal selection, manuscript preparation, peer review response, and academic writing best practices. What type of publication are you working on?";
  } else if (message.includes('ethics') || message.includes('ethical')) {
    return "Research ethics are crucial for academic integrity. I can help you understand ethical considerations, IRB requirements, informed consent, and responsible research practices. What ethical aspect concerns you?";
  } else if (message.includes('statistics') || message.includes('statistical')) {
    return "I can assist with statistical analysis including descriptive statistics, inferential tests, regression analysis, and choosing appropriate statistical methods for your research design. What statistical analysis do you need help with?";
  } else {
    return "That's an interesting research question! Could you provide more details about your specific area of study or what you'd like to explore further? I'm here to help with any academic research needs.";
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
app.post('/api/chat', (req, res) => {
  try {
    const { message, sessionId } = req.body;
    
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

      // Save user message to chat history
      const userMessage = {
        id: Date.now(),
        text: message,
        sender: 'user',
        timestamp: new Date().toISOString()
      };
      saveMessage(sessionId, userMessage);
      console.log(`💾 User message saved to chat history`);
    }

    // Simulate processing time
    setTimeout(() => {
      const botResponse = getBotResponse(message);
      
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
    }, 1000); // 1 second delay to simulate processing

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
