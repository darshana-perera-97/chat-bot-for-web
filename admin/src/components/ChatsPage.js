import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Badge, Spinner, Alert, InputGroup, Form } from 'react-bootstrap';
import Layout from './Layout';
import { getSessionsUrl, getChatHistoryUrl } from '../config/api';

const ChatsPage = ({ onPageChange }) => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch(getSessionsUrl());
      
      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }
      
      const data = await response.json();
      const sessionsData = data.sessions || []; // Extract sessions array from response
      setSessions(sessionsData);
      
      // Auto-select first session if available
      if (sessionsData.length > 0) {
        handleSessionSelect(sessionsData[0]);
      }
      
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError('Failed to load chat sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleSessionSelect = async (session) => {
    setSelectedSession(session);
    setChatLoading(true);
    
    try {
      const response = await fetch(getChatHistoryUrl(session.chatId));
      
      if (!response.ok) {
        throw new Error('Failed to fetch chat history');
      }
      
      const historyData = await response.json();
      setChatHistory(historyData.messages || []);
      
    } catch (err) {
      console.error('Error fetching chat history:', err);
      setChatHistory([]);
    } finally {
      setChatLoading(false);
    }
  };

  const filteredSessions = sessions.filter(session => 
    session.chatId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (session.timestamp && session.timestamp.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return timestamp;
    }
  };

  const getMessageCount = (session) => {
    return session.messageCount || 0;
  };

  const getSessionPreview = (session) => {
    if (session.lastMessage) {
      return session.lastMessage.length > 50 
        ? session.lastMessage.substring(0, 50) + '...'
        : session.lastMessage;
    }
    return 'No messages yet';
  };

  return (
    <Layout currentPage="chats" onPageChange={onPageChange}>
      <Container fluid className="py-4">
        <Row className="mb-4">
          <Col>
            <h2 className="text-info mb-0">
              <i className="fas fa-comments me-2"></i>
              Chats
            </h2>
            <p className="text-muted">Manage chat sessions and view conversations</p>
          </Col>
        </Row>

        {error && (
          <Row className="mb-4">
            <Col>
              <Alert variant="warning" className="d-flex align-items-center">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
              </Alert>
            </Col>
          </Row>
        )}

        <Row className="g-4">
          {/* Left Sidebar - Chat Sessions */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-light border-0">
                <h6 className="mb-0 text-dark">
                  <i className="fas fa-list me-2"></i>
                  Chat Sessions ({sessions.length})
                </h6>
              </Card.Header>
              <Card.Body className="p-0">
                {/* Search Bar */}
                <div className="p-3 border-bottom">
                  <InputGroup size="sm">
                    <InputGroup.Text>
                      <i className="fas fa-search"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search sessions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </div>

                {/* Sessions List */}
                <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  {loading ? (
                    <div className="p-4 text-center">
                      <Spinner animation="border" variant="info" size="sm" />
                      <p className="text-muted mt-2 mb-0">Loading sessions...</p>
                    </div>
                  ) : filteredSessions.length === 0 ? (
                    <div className="p-4 text-center">
                      <i className="fas fa-comments fa-2x text-muted mb-2"></i>
                      <p className="text-muted mb-0">
                        {searchTerm ? 'No sessions found' : 'No chat sessions available'}
                      </p>
                    </div>
                  ) : (
                    <ListGroup variant="flush">
                      {filteredSessions.map((session, index) => (
                        <ListGroup.Item
                          key={session.chatId}
                          className={`session-item ${selectedSession?.chatId === session.chatId ? 'active' : ''}`}
                          onClick={() => handleSessionSelect(session)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center mb-1">
                                <Badge bg="info" className="me-2">
                                  {getMessageCount(session)}
                                </Badge>
                                <small className="text-muted">
                                  {formatDate(session.timestamp)}
                                </small>
                              </div>
                              <h6 className="mb-1 text-dark">
                                Session {session.chatId.substring(0, 8)}...
                              </h6>
                              <p className="mb-0 text-muted small">
                                {getSessionPreview(session)}
                              </p>
                            </div>
                            <i className="fas fa-chevron-right text-muted"></i>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Right Side - Chat History */}
          <Col lg={8}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-light border-0">
                {selectedSession ? (
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-0 text-dark">
                        <i className="fas fa-comment-dots me-2"></i>
                        Chat History
                      </h6>
                      <small className="text-muted">
                        Session: {selectedSession.chatId}
                      </small>
                    </div>
                    <Badge bg="info">
                      {chatHistory.length} messages
                    </Badge>
                  </div>
                ) : (
                  <h6 className="mb-0 text-dark">
                    <i className="fas fa-comment-dots me-2"></i>
                    Select a chat session to view history
                  </h6>
                )}
              </Card.Header>
              <Card.Body className="p-0">
                {!selectedSession ? (
                  <div className="p-5 text-center" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <i className="fas fa-comments fa-3x text-muted mb-3"></i>
                    <h5 className="text-muted">No Session Selected</h5>
                    <p className="text-muted">
                      Choose a chat session from the sidebar to view the conversation history.
                    </p>
                  </div>
                ) : chatLoading ? (
                  <div className="p-5 text-center" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Spinner animation="border" variant="info" />
                    <p className="text-muted mt-2 mb-0">Loading chat history...</p>
                  </div>
                ) : chatHistory.length === 0 ? (
                  <div className="p-5 text-center" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <i className="fas fa-comment-slash fa-3x text-muted mb-3"></i>
                    <h5 className="text-muted">No Messages</h5>
                    <p className="text-muted">
                      This session doesn't have any messages yet.
                    </p>
                  </div>
                ) : (
                  <div 
                    className="chat-history p-3"
                    style={{ 
                      minHeight: '450px',
                      maxHeight: '450px', 
                      overflowY: 'auto',
                      backgroundColor: '#f8f9fa'
                    }}
                  >
                    {chatHistory.map((message, index) => (
                      <div
                        key={index}
                        className={`message-container mb-3 ${
                          message.sender === 'user' ? 'user-message' : 'bot-message'
                        }`}
                      >
                        <div
                          className={`message-bubble p-3 rounded ${
                            message.sender === 'user'
                              ? 'bg-primary text-white ms-auto'
                              : 'bg-white text-dark me-auto'
                          }`}
                          style={{
                            maxWidth: '70%',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                        >
                          <div className="message-content">
                            {message.text || message.content || 'No message content'}
                          </div>
                          <div
                            className={`message-time small mt-2 ${
                              message.sender === 'user' ? 'text-white-50' : 'text-muted'
                            }`}
                          >
                            {message.timestamp ? formatDate(message.timestamp) : 'Unknown time'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default ChatsPage;
