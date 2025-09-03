import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const CopyrightBar = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="copyright-bar bg-dark text-light py-3 mt-auto">
      <Container fluid>
        <Row className="align-items-center">
          <Col md={6}>
            <div className="d-flex align-items-center">
              <i className="fas fa-robot me-2 text-primary"></i>
              <span>
                © {currentYear} Chatbot Admin Dashboard. All rights reserved.
              </span>
            </div>
          </Col>
          <Col md={6} className="text-md-end">
            <div className="d-flex justify-content-md-end align-items-center">
              <small className="text-muted me-3">
                <i className="fas fa-code me-1"></i>
                Built with React & Bootstrap
              </small>
              <small className="text-muted">
                <i className="fas fa-heart text-danger me-1"></i>
                Made with love
              </small>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default CopyrightBar;
