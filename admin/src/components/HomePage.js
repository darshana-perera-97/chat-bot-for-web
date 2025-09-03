import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Layout from './Layout';

const HomePage = ({ onPageChange }) => {
  return (
    <Layout currentPage="home" onPageChange={onPageChange}>
      <Container className="py-4">
        <Row className="mb-4">
          <Col>
            <h2 className="text-primary mb-0">
              <i className="fas fa-home me-2"></i>
              Home
            </h2>
            <p className="text-muted">Welcome to the Home page</p>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-5 text-center">
                <div className="mb-4">
                  <i className="fas fa-home fa-4x text-primary"></i>
                </div>
                <h3 className="text-dark mb-3">Home Page</h3>
                <p className="text-muted lead">
                  This is the Home page of the admin dashboard. 
                  Here you can find quick access to all main features and overview information.
                </p>
                <div className="mt-4">
                  <small className="text-muted">
                    <i className="fas fa-info-circle me-1"></i>
                    Navigate to other sections using the top navigation or dashboard cards.
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

export default HomePage;
