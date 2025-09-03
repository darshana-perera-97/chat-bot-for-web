import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import Layout from './Layout';
import { getSessionsUrl, getChatHistoryUrl } from '../config/api';

const AnalyticsPage = ({ onPageChange }) => {
  const [analytics, setAnalytics] = useState({
    websites: 1,
    sessions: 0,
    chats: 0,
    recurringUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(getSessionsUrl());
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      
      const data = await response.json();
      const sessions = data.sessions || []; // Extract sessions array from response
      
      // Calculate analytics from sessions data
      const totalSessions = sessions.length;
      
      // Fetch chat history for each session to get accurate message counts
      let totalChats = 0;
      const userSessions = {};
      
      setCalculating(true);
      
      // Process each session to get message counts and user data
      for (const session of sessions) {
        try {
          // Fetch chat history for this session
          const historyResponse = await fetch(getChatHistoryUrl(session.chatId));
          if (historyResponse.ok) {
            const historyData = await historyResponse.json();
            const messages = historyData.messages || [];
            totalChats += messages.length;
            
            // Track user sessions (using chatId as user identifier)
            const userId = session.chatId;
            if (!userSessions[userId]) {
              userSessions[userId] = 0;
            }
            userSessions[userId]++;
          }
        } catch (err) {
          console.warn(`Failed to fetch history for session ${session.chatId}:`, err);
          // Still count the session even if we can't get its history
          const userId = session.chatId;
          if (!userSessions[userId]) {
            userSessions[userId] = 0;
          }
          userSessions[userId]++;
        }
      }
      
      // Calculate recurring users (users with more than 1 session)
      const recurringUsers = Object.values(userSessions).filter(count => count > 1).length;
      
      setAnalytics({
        websites: 1, // Static for now
        sessions: totalSessions,
        chats: totalChats,
        recurringUsers: recurringUsers
      });
      
      setCalculating(false);
      
    } catch (err) {
      console.error('Error fetching analytics:', err);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to load analytics data';
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        errorMessage = 'Cannot connect to backend server. Please ensure the server is running on port 3333.';
      } else if (err.message.includes('Failed to fetch analytics data')) {
        errorMessage = 'Backend server returned an error. Please check the server logs.';
      }
      
      setError(errorMessage);
      
      // Set default values on error
      setAnalytics({
        websites: 1,
        sessions: 0,
        chats: 0,
        recurringUsers: 0
      });
    } finally {
      setLoading(false);
      setCalculating(false);
    }
  };

  const analyticsCards = [
    {
      title: 'Websites',
      value: analytics.websites,
      icon: 'fas fa-globe',
      color: 'primary',
      bgColor: 'bg-primary',
      description: 'Total websites using the chatbot'
    },
    {
      title: 'Sessions',
      value: analytics.sessions,
      icon: 'fas fa-users',
      color: 'success',
      bgColor: 'bg-success',
      description: 'Total chat sessions created'
    },
    {
      title: 'Total Messages',
      value: analytics.chats,
      icon: 'fas fa-comments',
      color: 'info',
      bgColor: 'bg-info',
      description: 'All messages exchanged (user + bot)'
    },
    {
      title: 'Recurring Users',
      value: analytics.recurringUsers,
      icon: 'fas fa-user-friends',
      color: 'warning',
      bgColor: 'bg-warning',
      description: 'Users with multiple sessions'
    }
  ];

  if (loading) {
    return (
      <Layout currentPage="analytics" onPageChange={onPageChange}>
        <Container className="py-4">
          <Row className="mb-4">
            <Col>
              <h2 className="text-success mb-0">
                <i className="fas fa-chart-line me-2"></i>
                Analytics
              </h2>
              <p className="text-muted">View performance metrics and usage statistics</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-5 text-center">
                  <Spinner animation="border" variant="success" className="mb-3" />
                  <h5 className="text-muted">
                    {calculating ? 'Calculating detailed analytics...' : 'Loading analytics data...'}
                  </h5>
                  {calculating && (
                    <p className="text-muted small mt-2">
                      Fetching chat histories and calculating message counts...
                    </p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout currentPage="analytics" onPageChange={onPageChange}>
      <Container className="py-4">
        <Row className="mb-4">
          <Col>
            <h2 className="text-success mb-0">
              <i className="fas fa-chart-line me-2"></i>
              Analytics
            </h2>
            <p className="text-muted">View performance metrics and usage statistics</p>
          </Col>
        </Row>

        {error && (
          <Row className="mb-4">
            <Col>
              <Alert variant="warning" className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
                <button 
                  className="btn btn-outline-warning btn-sm"
                  onClick={fetchAnalytics}
                  disabled={loading}
                >
                  <i className="fas fa-redo me-1"></i>
                  Retry
                </button>
              </Alert>
            </Col>
          </Row>
        )}

        {/* Analytics Cards */}
        <Row className="g-4 mb-4">
          {analyticsCards.map((card, index) => (
            <Col md={6} lg={3} key={index}>
              <Card className="border-0 shadow-sm analytics-card h-100">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className={`${card.bgColor} text-white rounded-circle p-3 me-3`}>
                      <i className={`${card.icon} fa-lg`}></i>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="text-muted mb-1 small text-uppercase">{card.title}</h6>
                      <h3 className={`text-${card.color} mb-1 fw-bold`}>{card.value.toLocaleString()}</h3>
                      <small className="text-muted">{card.description}</small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Additional Analytics Section */}
        <Row>
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h5 className="text-dark mb-3">
                  <i className="fas fa-chart-bar me-2 text-success"></i>
                  Chat Analytics Overview
                </h5>
                <Row>
                  <Col md={3}>
                    <div className="mb-3">
                      <h6 className="text-muted mb-2">System Status</h6>
                      <div className="d-flex align-items-center">
                        <div className="bg-success rounded-circle p-2 me-2">
                          <i className="fas fa-check text-white"></i>
                        </div>
                        <span className="text-success fw-bold">System Online</span>
                      </div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="mb-3">
                      <h6 className="text-muted mb-2">Avg Messages/Session</h6>
                      <div className="d-flex align-items-center">
                        <i className="fas fa-calculator text-muted me-2"></i>
                        <span className="fw-bold">
                          {analytics.sessions > 0 ? Math.round(analytics.chats / analytics.sessions) : 0}
                        </span>
                      </div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="mb-3">
                      <h6 className="text-muted mb-2">User Retention</h6>
                      <div className="d-flex align-items-center">
                        <i className="fas fa-percentage text-muted me-2"></i>
                        <span className="fw-bold">
                          {analytics.sessions > 0 ? Math.round((analytics.recurringUsers / analytics.sessions) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="mb-3">
                      <h6 className="text-muted mb-2">Last Updated</h6>
                      <div className="d-flex align-items-center">
                        <i className="fas fa-clock text-muted me-2"></i>
                        <span>{new Date().toLocaleString()}</span>
                      </div>
                    </div>
                  </Col>
                </Row>
                <hr />
                <div className="text-center">
                  <small className="text-muted">
                    <i className="fas fa-info-circle me-1"></i>
                    Analytics data is updated in real-time from the chatbot backend.
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default AnalyticsPage;