import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import './App.css';

const API_BASE_URL = 'http://localhost:5060/api';

function App() {
  const [sessions, setSessions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/chats`);
      setSessions(response.data);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      setError('Failed to load chat sessions. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSessionClick = async (sessionId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chats/${sessionId}`);
      setSelectedSession(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Failed to fetch session details:', error);
      setError('Failed to load chat session details.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSession(null);
  };

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

  const getSessionPreview = (messages) => {
    if (!messages || messages.length === 0) return 'No messages yet';
    
    const lastMessage = messages[messages.length - 1];
    const preview = lastMessage.content.substring(0, 100);
    return preview.length < lastMessage.content.length ? preview + '...' : preview;
  };

  const getMessageCount = (messages) => {
    return messages ? messages.length : 0;
  };

  const getUserMessageCount = (messages) => {
    return messages ? messages.filter(msg => msg.type === 'user').length : 0;
  };

  const getAIMessageCount = (messages) => {
    return messages ? messages.filter(msg => msg.type === 'ai').length : 0;
  };

  const formatMessageTime = (timestamp) => {
    try {
      return format(parseISO(timestamp), 'HH:mm');
    } catch {
      return timestamp;
    }
  };

  const sessionsArray = Object.values(sessions).sort((a, b) => 
    new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
  );

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="icon">🔄</div>
          Loading chat sessions...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">
          <h3>⚠️ Error</h3>
          <p>{error}</p>
          <button className="refresh-button" onClick={fetchSessions}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="header">
        <h1>📊 Chat Session Reader</h1>
        <p>View and analyze all your AI chatbot conversations</p>
      </div>

      <div className="chat-sessions-container">
        {sessionsArray.length === 0 ? (
          <div className="empty-state">
            <div className="icon">💬</div>
            <h3>No Chat Sessions Found</h3>
            <p>Start chatting with the AI bot to see sessions here</p>
            <button className="refresh-button" onClick={fetchSessions}>
              Refresh
            </button>
          </div>
        ) : (
          <>
            <button className="refresh-button" onClick={fetchSessions}>
              🔄 Refresh Sessions
            </button>
            
            <div className="sessions-grid">
              {sessionsArray.map((session) => (
                <div
                  key={session.sessionId}
                  className="session-card"
                  onClick={() => handleSessionClick(session.sessionId)}
                >
                  <div className="session-header">
                    <div className="session-id">
                      Session: {session.sessionId.substring(0, 8)}...
                    </div>
                    <div className="session-date">
                      {formatDate(session.updatedAt || session.createdAt)}
                    </div>
                  </div>

                  <div className="session-stats">
                    <div className="stat">
                      <div className="stat-number">{getMessageCount(session.messages)}</div>
                      <div className="stat-label">Total</div>
                    </div>
                    <div className="stat">
                      <div className="stat-number">{getUserMessageCount(session.messages)}</div>
                      <div className="stat-label">User</div>
                    </div>
                    <div className="stat">
                      <div className="stat-number">{getAIMessageCount(session.messages)}</div>
                      <div className="stat-label">AI</div>
                    </div>
                  </div>

                  <div className="session-preview">
                    {getSessionPreview(session.messages)}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {showModal && selectedSession && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                Chat Session: {selectedSession.sessionId.substring(0, 12)}...
              </div>
              <button className="close-button" onClick={closeModal}>
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <div className="chat-messages">
                {selectedSession.messages && selectedSession.messages.length > 0 ? (
                  selectedSession.messages.map((message) => (
                    <div key={message.id} className={`chat-message ${message.type}`}>
                      <div className="message-bubble">
                        {message.content}
                      </div>
                      <div className="message-time">
                        {formatMessageTime(message.timestamp)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <div className="icon">💬</div>
                    <h3>No Messages</h3>
                    <p>This session doesn't have any messages yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
