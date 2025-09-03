// API Configuration
const API_CONFIG = {
  // Backend server URL - can be overridden by environment variables
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3333',
  
  // API endpoints
  ENDPOINTS: {
    SESSIONS: '/api/sessions',
    CHAT_HISTORY: '/api/chat/history',
    HEALTH: '/api/health',
    CHAT: '/api/chat'
  },
  
  // Request timeout (in milliseconds)
  TIMEOUT: 10000,
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get specific endpoint URLs
export const getSessionsUrl = () => getApiUrl(API_CONFIG.ENDPOINTS.SESSIONS);
export const getChatHistoryUrl = (sessionId) => getApiUrl(`${API_CONFIG.ENDPOINTS.CHAT_HISTORY}/${sessionId}`);
export const getHealthUrl = () => getApiUrl(API_CONFIG.ENDPOINTS.HEALTH);
export const getChatUrl = () => getApiUrl(API_CONFIG.ENDPOINTS.CHAT);

// Helper function to get base URL
export const getBaseUrl = () => API_CONFIG.BASE_URL;

// Helper function to get configuration
export const getConfig = () => API_CONFIG;

// Export the main config
export default API_CONFIG;
