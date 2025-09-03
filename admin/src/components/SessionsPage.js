import React from 'react';
import { Row, Col, Card, Button, Badge } from 'react-bootstrap';
import Layout from './Layout';

const SessionsPage = () => {
  return (
    <Layout currentPage="sessions" onPageChange={() => {}}>
      <div className="sessions-page">
        {/* Page Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">
              <i className="fas fa-comments me-2 text-primary"></i>
              Chat Sessions
            </h2>
            <p className="text-muted mb-0">Manage and monitor all chatbot conversations</p>
          </div>
          <Button variant="primary" size="lg">
            <i className="fas fa-plus me-1"></i>
            New Session
          </Button>
        </div>

        {/* Sessions Content */}
        <Row>
          <Col md={8}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">
                  <i className="fas fa-list me-2"></i>
                  Active Sessions
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="text-center py-5">
                  <i className="fas fa-comments fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">No active sessions</h5>
                  <p className="text-muted">Sessions will appear here when users start chatting</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">
                  <i className="fas fa-chart-pie me-2"></i>
                  Session Statistics
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span>Total Sessions</span>
                  <Badge bg="primary">0</Badge>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span>Active Sessions</span>
                  <Badge bg="success">0</Badge>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span>Completed Sessions</span>
                  <Badge bg="secondary">0</Badge>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span>Average Duration</span>
                  <Badge bg="info">0m</Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default SessionsPage;
