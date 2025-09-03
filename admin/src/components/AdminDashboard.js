import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Layout from './Layout';

const AdminDashboard = ({ onPageChange }) => {
  const handleCardClick = (page) => {
    onPageChange(page);
  };

  return (
    <Layout currentPage="dashboard" onPageChange={onPageChange}>
      <Container className="py-4">
        <Row className="mb-4">
          <Col>
            <h2 className="text-primary mb-0">
              <i className="fas fa-tachometer-alt me-2"></i>
              Admin Dashboard
            </h2>
            <p className="text-muted">Welcome to the chatbot administration panel</p>
          </Col>
        </Row>

        <Row className="g-4">
          {/* Home Card */}
          <Col md={6} lg={3}>
            <Card 
              className="h-100 shadow-sm border-0 dashboard-card"
              onClick={() => handleCardClick('home')}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
            >
              <Card.Body className="text-center p-4">
                <div className="mb-3">
                  <i className="fas fa-home fa-3x text-primary"></i>
                </div>
                <h5 className="card-title text-dark">Home</h5>
                <p className="card-text text-muted small">
                  Overview and quick access to main features
                </p>
                <Button variant="outline-primary" size="sm">
                  <i className="fas fa-arrow-right me-1"></i>
                  Go to Home
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Analytics Card */}
          <Col md={6} lg={3}>
            <Card 
              className="h-100 shadow-sm border-0 dashboard-card"
              onClick={() => handleCardClick('analytics')}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
            >
              <Card.Body className="text-center p-4">
                <div className="mb-3">
                  <i className="fas fa-chart-line fa-3x text-success"></i>
                </div>
                <h5 className="card-title text-dark">Analytics</h5>
                <p className="card-text text-muted small">
                  View performance metrics and usage statistics
                </p>
                <Button variant="outline-success" size="sm">
                  <i className="fas fa-arrow-right me-1"></i>
                  View Analytics
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Chats Card */}
          <Col md={6} lg={3}>
            <Card 
              className="h-100 shadow-sm border-0 dashboard-card"
              onClick={() => handleCardClick('chats')}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
            >
              <Card.Body className="text-center p-4">
                <div className="mb-3">
                  <i className="fas fa-comments fa-3x text-info"></i>
                </div>
                <h5 className="card-title text-dark">Chats</h5>
                <p className="card-text text-muted small">
                  Manage chat sessions and view conversations
                </p>
                <Button variant="outline-info" size="sm">
                  <i className="fas fa-arrow-right me-1"></i>
                  Manage Chats
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Settings Card */}
          <Col md={6} lg={3}>
            <Card 
              className="h-100 shadow-sm border-0 dashboard-card"
              onClick={() => handleCardClick('settings')}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
            >
              <Card.Body className="text-center p-4">
                <div className="mb-3">
                  <i className="fas fa-cog fa-3x text-warning"></i>
                </div>
                <h5 className="card-title text-dark">Settings</h5>
                <p className="card-text text-muted small">
                  Configure system settings and preferences
                </p>
                <Button variant="outline-warning" size="sm">
                  <i className="fas fa-arrow-right me-1"></i>
                  Open Settings
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Quick Stats Row */}
        <Row className="mt-5">
          <Col>
            <Card className="border-0 bg-light">
              <Card.Body className="text-center py-4">
                <h6 className="text-muted mb-3">Quick Stats</h6>
                <Row>
                  <Col md={3}>
                    <div className="text-center">
                      <h4 className="text-primary mb-1">0</h4>
                      <small className="text-muted">Total Sessions</small>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center">
                      <h4 className="text-success mb-1">0</h4>
                      <small className="text-muted">Active Users</small>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center">
                      <h4 className="text-info mb-1">0</h4>
                      <small className="text-muted">Messages Today</small>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center">
                      <h4 className="text-warning mb-1">0</h4>
                      <small className="text-muted">System Status</small>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default AdminDashboard;