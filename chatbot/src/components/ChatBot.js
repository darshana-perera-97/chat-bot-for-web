import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';
import { getChatUrl, getChatHistoryUrl, getBaseUrl } from '../config/api';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Generate unique session ID
  const generateSessionId = () => {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  // Load chat history from backend
  const loadChatHistory = async (sessionId) => {
    try {
      const response = await fetch(getChatHistoryUrl(sessionId));
      if (response.ok) {
        const data = await response.json();
        if (data.messages && data.messages.length > 0) {
          console.log(`📚 Loaded ${data.messages.length} previous messages for session: ${sessionId}`);
          setMessages(data.messages);
          return true;
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
    return false;
  };

  // Start new chat session
  const startNewChat = () => {
    const newSessionId = generateSessionId();
    localStorage.setItem('chatbot_session_id', newSessionId);
    setSessionId(newSessionId);
    setMessages([
      { id: 1, text: "Hello! I'm your AI Research Assistant. I can help you with literature reviews, research questions, academic writing, and more. How can I assist you today?", sender: 'bot' }
    ]);
  };

    // Initialize session on component mount
  useEffect(() => {
    const initializeSession = async () => {
      try {
        setIsLoading(true);
        let currentSessionId = localStorage.getItem('chatbot_session_id');
        
        if (!currentSessionId) {
          currentSessionId = generateSessionId();
          localStorage.setItem('chatbot_session_id', currentSessionId);
          console.log(`🆕 Created new session: ${currentSessionId}`);
        } else {
          console.log(`♻️  Found existing session: ${currentSessionId}`);
        }
        
        setSessionId(currentSessionId);
        
        // Try to load previous chat history
        const historyLoaded = await loadChatHistory(currentSessionId);
        
        if (!historyLoaded) {
          // If no history found, set default welcome message
          setMessages([
            { id: 1, text: "Hello! I'm your Solar System Sales Representative. I can help you learn about solar energy solutions, cost savings, installation processes, and environmental benefits. What would you like to know about solar systems for your home or business?", sender: 'bot' }
          ]);
          console.log(`💬 Started with welcome message for session: ${currentSessionId}`);
        }
      } catch (error) {
        console.error('Error initializing session:', error);
        // Fallback to welcome message
        setMessages([
          { id: 1, text: "Hello! I'm your Solar System Sales Representative. I can help you learn about solar energy solutions, cost savings, installation processes, and environmental benefits. What would you like to know about solar systems for your home or business?", sender: 'bot' }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '' || !sessionId) return;

    const userMessage = inputMessage.trim();
    const newMessage = {
      id: messages.length + 1,
      text: userMessage,
      sender: 'user'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    try {
      // Send message to backend with session ID
      const response = await fetch(getChatUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          sessionId: sessionId
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle service unavailable error
        if (response.status === 503 && data.serviceUnavailable) {
          const serviceUnavailableResponse = {
            id: messages.length + 2,
            text: "⚠️ Chatbot server is not working. The AI service is currently unavailable. Please try again later or contact support.",
            sender: 'bot'
          };
          setMessages(prev => [...prev, serviceUnavailableResponse]);
          return;
        } else {
          throw new Error(data.error || 'Failed to get response from server');
        }
      }

      const botResponse = {
        id: messages.length + 2,
        text: data.response,
        sender: 'bot'
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error sending message:', error);

      // Fallback response if backend is not available
      const fallbackResponse = {
        id: messages.length + 2,
        text: `❌ I'm sorry, I'm having trouble connecting to the server. Please make sure the backend server is running at ${getBaseUrl()}.`,
        sender: 'bot'
      };

      setMessages(prev => [...prev, fallbackResponse]);
    }
  };



  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot-fullscreen">
      <div className="chatbot-window">
        <div className="chatbot-header">
          <h3>Research Assistant</h3>
        </div>

                <div className="chatbot-messages">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <div className="loading-text">Loading chat history...</div>
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.sender}`}
              >
                <div className="message-content">
                  {message.text}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-input">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isLoading ? "Loading..." : "Type your message..."}
            className="message-input"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            className="send-btn"
            disabled={isLoading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
