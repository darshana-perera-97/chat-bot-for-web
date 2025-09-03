import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import HomePage from './components/HomePage';
import AnalyticsPage from './components/AnalyticsPage';
import ChatsPage from './components/ChatsPage';
import SettingsPage from './components/SettingsPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Check if user is already logged in on component mount
  useEffect(() => {
    const loginStatus = localStorage.getItem('admin_logged_in');
    const loginTime = localStorage.getItem('admin_login_time');
    
    if (loginStatus === 'true' && loginTime) {
      // Check if login is still valid (24 hours)
      const loginDate = new Date(loginTime);
      const now = new Date();
      const hoursDiff = (now - loginDate) / (1000 * 60 * 60);
      
      if (hoursDiff < 24) {
        setIsLoggedIn(true);
      } else {
        // Clear expired login
        localStorage.removeItem('admin_logged_in');
        localStorage.removeItem('admin_login_time');
      }
    }
  }, []);

  const handleLogin = (success) => {
    setIsLoggedIn(success);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_login_time');
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onPageChange={setCurrentPage} />;
      case 'analytics':
        return <AnalyticsPage onPageChange={setCurrentPage} />;
      case 'chats':
        return <ChatsPage onPageChange={setCurrentPage} />;
      case 'settings':
        return <SettingsPage onPageChange={setCurrentPage} />;
      default:
        return <AdminDashboard onPageChange={setCurrentPage} />;
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;
