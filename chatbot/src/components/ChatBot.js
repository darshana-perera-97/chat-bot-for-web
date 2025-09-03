import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI Research Assistant. I can help you with literature reviews, research questions, academic writing, and more. How can I assist you today?", sender: 'bot' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const userMessage = inputMessage.trim();
    const newMessage = {
      id: messages.length + 1,
      text: userMessage,
      sender: 'user'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    try {
      // Send message to backend
      const response = await fetch('http://localhost:3333/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      const data = await response.json();
      
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
        text: "I'm sorry, I'm having trouble connecting to the server. Please make sure the backend server is running on port 3333.",
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
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`message ${message.sender}`}
            >
              <div className="message-content">
                {message.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="chatbot-input">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="message-input"
          />
          <button 
            onClick={handleSendMessage}
            className="send-btn"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
