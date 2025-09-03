# Chatbot Backend Server

This is the backend server for the chatbot application that handles message processing and response generation.

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Start the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3333`

## API Endpoints

### GET /
- **Description**: Server status
- **Response**: Server information and status

### POST /api/chat
- **Description**: Send a message to the chatbot
- **Body**: `{ "message": "your message here" }`
- **Response**: `{ "response": "bot response", "status": "success", "timestamp": "...", "userMessage": "..." }`

### GET /api/health
- **Description**: Health check endpoint
- **Response**: Server health status and uptime

## Environment Variables

Create a `.env` file in the backend directory:
```
PORT=3333
NODE_ENV=development
```

## Features

- **Research-focused responses**: Specialized for academic research assistance
- **Error handling**: Graceful error handling with fallback responses
- **CORS enabled**: Allows frontend communication
- **JSON API**: RESTful API design
- **Health monitoring**: Health check endpoint for monitoring

## Dependencies

- **express**: Web framework
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management
- **nodemon**: Development auto-restart (dev dependency)
