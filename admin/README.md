# Chatbot Admin Dashboard

A professional React.js admin dashboard for managing and monitoring chatbot sessions, built with Bootstrap and React Bootstrap.

## Features

### 📊 **Dashboard Overview**
- **Real-time Statistics**: Total sessions, active sessions, recent sessions
- **Backend Status**: Live connection status to the chatbot backend
- **Session Management**: View and manage all chatbot sessions

### 📋 **Session Management**
- **Session List**: Complete table of all chat sessions
- **Status Indicators**: Active, Recent, and Inactive session badges
- **Session Details**: Creation time, last activity, and session ID
- **Chat History**: View complete conversation history for any session

### 🎨 **Modern UI/UX**
- **Bootstrap 5**: Professional, responsive design
- **Font Awesome Icons**: Beautiful iconography throughout
- **Hover Effects**: Smooth animations and transitions
- **Mobile Responsive**: Works perfectly on all devices
- **Loading States**: Professional loading indicators

### 🔧 **Technical Features**
- **Real-time Data**: Fetches live data from backend API
- **Error Handling**: Graceful error handling with user feedback
- **Modal Views**: Clean modal interface for chat history
- **Auto-refresh**: Manual refresh functionality
- **Session Status**: Intelligent session status detection

## Setup Instructions

### 1. Install Dependencies
```bash
cd admin
npm install
```

### 2. Start the Development Server
```bash
npm start
```

The admin dashboard will be available at `http://localhost:3001`

### 3. Backend Requirements
Make sure the chatbot backend server is running on `http://localhost:3333`

### 4. Configuration (Optional)
You can customize the backend URL by creating a `.env` file in the admin directory:

```bash
# Backend server URL
REACT_APP_API_URL=http://localhost:3333
```

## API Endpoints Used

- **GET /api/sessions** - Fetch all session IDs
- **GET /api/chat/history/:sessionId** - Get chat history for a session

## Components

### AdminDashboard
Main dashboard component that includes:
- Navigation bar with refresh functionality
- Statistics cards showing key metrics
- Sessions table with status indicators
- Chat history modal for detailed conversation view

## Configuration

### API Configuration
The admin dashboard uses a centralized configuration system located in `src/config/api.js`:

- **Centralized URLs**: All backend URLs managed in one place
- **Environment Support**: Can be overridden with environment variables
- **Helper Functions**: Easy-to-use functions for generating API URLs
- **Type Safety**: Consistent URL generation across the application

### Configuration Files
- `src/config/api.js` - Main API configuration
- `src/config/README.md` - Detailed configuration documentation

## Styling

- **Bootstrap 5**: Complete Bootstrap framework
- **React Bootstrap**: Bootstrap components for React
- **Font Awesome**: Professional icons
- **Custom CSS**: Additional styling for animations and effects

## Features in Detail

### Session Status Detection
- **Active**: Sessions created within the last hour
- **Recent**: Sessions created within the last 24 hours
- **Inactive**: Sessions older than 24 hours

### Chat History Modal
- **Complete Conversation**: View all messages in chronological order
- **Message Formatting**: User messages in blue, bot messages in light gray
- **Timestamps**: Precise timing for each message
- **Session Metadata**: Creation time, last update, total messages

### Error Handling
- **Connection Errors**: Clear error messages when backend is unavailable
- **Loading States**: Professional loading indicators
- **Retry Functionality**: Easy retry buttons for failed operations

## Development

### Available Scripts
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Dependencies
- **React**: ^19.1.1
- **Bootstrap**: ^5.3.0
- **React Bootstrap**: ^2.9.0
- **Font Awesome**: 6.0.0 (CDN)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Responsive Design

The dashboard is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All screen sizes

## Future Enhancements

- Real-time updates with WebSocket
- Session analytics and charts
- Export functionality for chat data
- User management features
- Advanced filtering and search