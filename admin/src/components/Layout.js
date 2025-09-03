import React from 'react';
import { Container } from 'react-bootstrap';
import TopBar from './TopBar';
import CopyrightBar from './CopyrightBar';

const Layout = ({ children, currentPage, onPageChange }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Top Navigation Bar */}
      <TopBar currentPage={currentPage} onPageChange={onPageChange} />
      
      {/* Main Content */}
      <main className="flex-grow-1">
        <Container fluid className="py-4">
          {children}
        </Container>
      </main>
      
      {/* Copyright Footer */}
      <CopyrightBar />
    </div>
  );
};

export default Layout;
