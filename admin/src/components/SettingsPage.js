import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Layout from './Layout';

const SettingsPage = ({ onPageChange }) => {
  return (
    <Layout currentPage="settings" onPageChange={onPageChange}>
      <Container className="py-4">
        <Row className="mb-4">
          <Col>
            <h2 className="text-warning mb-0">
              <i className="fas fa-cog me-2"></i>
              Settings
            </h2>
            <p className="text-muted">Configure system settings and preferences</p>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-5 text-center">
                <div className="mb-4">
                  <i className="fas fa-cog fa-4x text-warning"></i>
                </div>
                <h3 className="text-dark mb-3">Settings Page</h3>
                <p className="text-muted lead">
                  This is the Settings page where you can configure system preferences, 
                  manage chatbot settings, and customize the admin panel.
                </p>
                <div className="mt-4">
                  <small className="text-muted">
                    <i className="fas fa-info-circle me-1"></i>
                    Configuration options will be implemented here in future updates.
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

export default SettingsPage;