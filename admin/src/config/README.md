# API Configuration

This directory contains the API configuration for the admin dashboard.

## Files

### `api.js`
Main configuration file that contains:
- Backend server URL
- API endpoints
- Request timeout settings
- Default headers

## Configuration

### Environment Variables
You can override the default backend URL by setting the `REACT_APP_API_URL` environment variable.

Create a `.env` file in the admin root directory:

```bash
# Backend server URL
REACT_APP_API_URL=http://localhost:3333
```

### Default Configuration
- **Base URL**: `http://localhost:3333`
- **Timeout**: 10 seconds
- **Content Type**: `application/json`

## Usage

```javascript
import { getSessionsUrl, getChatHistoryUrl, getBaseUrl } from '../config/api';

// Get sessions endpoint
const sessionsUrl = getSessionsUrl(); // http://localhost:3333/api/sessions

// Get chat history for a session
const chatUrl = getChatHistoryUrl('session_123'); // http://localhost:3333/api/chat/history/session_123

// Get base URL
const baseUrl = getBaseUrl(); // http://localhost:3333
```

## Endpoints

- `/api/sessions` - Get all chat sessions
- `/api/chat/history/:sessionId` - Get chat history for a session
- `/api/health` - Health check endpoint
- `/api/chat` - Send message to chatbot

## Benefits

1. **Centralized Configuration**: All API URLs in one place
2. **Environment Support**: Easy to change URLs for different environments
3. **Type Safety**: Consistent URL generation
4. **Maintainability**: Easy to update endpoints
5. **Reusability**: Can be used across multiple components
