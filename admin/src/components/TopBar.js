import React from 'react';
import { Navbar, Nav, Container, Badge, Button } from 'react-bootstrap';

const TopBar = ({ currentPage, onPageChange }) => {
  const currentTime = new Date().toLocaleString();

  const handleNavClick = (page) => {
    onPageChange(page);
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="topbar">
      <Container fluid>
        <Navbar.Brand 
          href="#home" 
          className="d-flex align-items-center"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('dashboard');
          }}
          style={{ cursor: 'pointer' }}
        >
          <i className="fas fa-robot me-2"></i>
          <div>
            <div className="fw-bold">Chatbot Admin</div>
            <small className="opacity-75">Management Dashboard</small>
          </div>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link 
              href="#dashboard" 
              className={`text-white ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('dashboard');
              }}
            >
              <i className="fas fa-tachometer-alt me-1"></i>
              Dashboard
            </Nav.Link>
            <Nav.Link 
              href="#home" 
              className={`text-white ${currentPage === 'home' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('home');
              }}
            >
              <i className="fas fa-home me-1"></i>
              Home
            </Nav.Link>
            <Nav.Link 
              href="#analytics" 
              className={`text-white ${currentPage === 'analytics' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('analytics');
              }}
            >
              <i className="fas fa-chart-bar me-1"></i>
              Analytics
            </Nav.Link>
            <Nav.Link 
              href="#chats" 
              className={`text-white ${currentPage === 'chats' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('chats');
              }}
            >
              <i className="fas fa-comments me-1"></i>
              Chats
            </Nav.Link>
            <Nav.Link 
              href="#settings" 
              className={`text-white ${currentPage === 'settings' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('settings');
              }}
            >
              <i className="fas fa-cog me-1"></i>
              Settings
            </Nav.Link>
            
            {/* Status Indicator */}
            <div className="ms-3 d-flex align-items-center">
              <Badge bg="success" className="me-2">
                <i className="fas fa-circle me-1" style={{ fontSize: '0.5rem' }}></i>
                Online
              </Badge>
              <small className="text-white-50 me-3">
                {currentTime}
              </small>
              <Button
                variant="outline-light"
                size="sm"
                onClick={() => {
                  localStorage.removeItem('admin_logged_in');
                  localStorage.removeItem('admin_login_time');
                  window.location.reload();
                }}
                title="Logout"
              >
                <i className="fas fa-sign-out-alt me-1"></i>
                Logout
              </Button>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopBar;
