# Chatbot Backend Server

This is the backend server for the chatbot application that handles message processing and response generation using OpenAI's GPT models.

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure OpenAI API
1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)

3. Edit `.env` file and add your API key:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   PORT=3333
   ```

### 3. Start the Server
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
- **Body**: `{ "message": "your message here", "sessionId": "session_id" }`
- **Response**: `{ "response": "bot response", "status": "success", "timestamp": "...", "userMessage": "...", "sessionId": "..." }`
- **Note**: Automatically stores new session IDs in `./data/chatIds.json`

### GET /api/sessions
- **Description**: Get all stored session IDs
- **Response**: `{ "sessions": [...], "total": 5, "status": "success", "timestamp": "..." }`

### GET /api/chat/history/:sessionId
- **Description**: Get chat history for a specific session
- **Response**: `{ "sessionId": "...", "messages": [...], "createdAt": "...", "lastUpdated": "...", "totalMessages": 10, "status": "success" }`

### GET /api/health
- **Description**: Health check endpoint
- **Response**: Server health status and uptime

## Environment Variables

Create a `.env` file in the backend directory:
```
OPENAI_API_KEY=your_openai_api_key_here
PORT=3333
NODE_ENV=development
```

**Important**: Never commit your `.env` file to version control. Keep your OpenAI API key secure.

## Features

- **OpenAI Integration**: Uses GPT-3.5-turbo for intelligent, context-aware responses
- **Research-focused responses**: Specialized for academic research assistance
- **Conversation Context**: Maintains conversation history for better responses
- **Session Management**: Automatic storage of session IDs with timestamps
- **Chat History**: Complete conversation history stored by session ID
- **Data Persistence**: 
  - Session IDs stored in `./data/chatIds.json`
  - Chat history stored in `./data/chats.json`
- **Error handling**: Graceful error handling with fallback responses
- **CORS enabled**: Allows frontend communication
- **JSON API**: RESTful API design
- **Health monitoring**: Health check endpoint for monitoring

## Dependencies

- **express**: Web framework
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management
- **openai**: OpenAI API client for GPT models
- **nodemon**: Development auto-restart (dev dependency)

## OpenAI Configuration

The chatbot uses OpenAI's GPT-3.5-turbo model with the following configuration:
- **Model**: gpt-3.5-turbo
- **Max Tokens**: 500
- **Temperature**: 0.7 (balanced creativity and consistency)
- **Context Window**: Last 10 messages for conversation context
- **System Prompt**: Specialized for academic research assistance

## Cost Considerations

- OpenAI API usage is charged per token
- GPT-3.5-turbo is cost-effective for most use cases
- Monitor your usage in the OpenAI dashboard
- Consider implementing rate limiting for production use
