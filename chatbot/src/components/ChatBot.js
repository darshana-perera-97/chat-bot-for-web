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

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(inputMessage),
        sender: 'bot'
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

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
    } else {
      return "That's an interesting research question! Could you provide more details about your specific area of study or what you'd like to explore further?";
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
