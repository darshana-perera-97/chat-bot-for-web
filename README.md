# AI Chatbot System

A comprehensive AI chatbot system with Node.js backend, React frontend, and HTML landing page integration.

## 🏗️ Project Structure

```
chat-bot-for-web/
├── backend/                 # Node.js Express server
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   └── data/               # Chat storage directory
│       └── chats.json      # Chat sessions storage
├── frontend-chatbot/       # React chatbot interface
│   ├── src/
│   │   ├── App.js         # Main chatbot component
│   │   ├── App.css        # Chatbot styles
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles
│   ├── public/
│   │   └── index.html     # HTML template
│   └── package.json       # Frontend dependencies
├── chat-reader/           # React app to read chat sessions
│   ├── src/
│   │   ├── App.js         # Chat reader component
│   │   ├── App.css        # Reader styles
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles
│   ├── public/
│   │   └── index.html     # HTML template
│   └── package.json       # Reader dependencies
├── html sample page/      # Landing page with iframe
│   └── index.html         # Main landing page
└── README.md              # This file
```

## 🚀 Quick Start

### 1. Start the Backend Server

```bash
cd backend
npm install
npm start
```

The backend will run on `http://localhost:5060`

### 2. Start the React Chatbot

```bash
cd frontend-chatbot
npm install
npm start
```

The chatbot will run on `http://localhost:3000`

### 3. Start the Chat Reader (Optional)

```bash
cd chat-reader
npm install
npm start
```

The chat reader will run on `http://localhost:3002`

### 4. Open the Landing Page

Open `html sample page/index.html` in your browser to see the complete integration.

## 🔧 Features

### Backend (Node.js + Express)
- ✅ RESTful API for chat management
- ✅ Local file storage for chat sessions
- ✅ Simple AI response generation
- ✅ CORS enabled for frontend integration
- ✅ Session management with UUID
- ✅ Message history tracking

### Frontend Chatbot (React)
- ✅ Modern, responsive chat interface
- ✅ Real-time messaging
- ✅ Typing indicators
- ✅ Message timestamps
- ✅ Auto-scroll to latest messages
- ✅ Beautiful gradient design
- ✅ Mobile-friendly

### HTML Landing Page
- ✅ Professional landing page design
- ✅ Iframe integration for chatbot
- ✅ Responsive layout
- ✅ Feature showcase
- ✅ Smooth scrolling navigation

### Chat Reader (React)
- ✅ View all chat sessions
- ✅ Session statistics
- ✅ Message preview
- ✅ Detailed chat view modal
- ✅ Search and filter capabilities
- ✅ Responsive design

## 📡 API Endpoints

### Backend API (`http://localhost:5060/api`)

- `GET /health` - Health check
- `GET /chats` - Get all chat sessions
- `GET /chats/:sessionId` - Get specific chat session
- `POST /chats` - Create new chat session
- `POST /chats/:sessionId/messages` - Send message to chatbot

## 🎨 Customization

### AI Responses
Edit the `generateAIResponse` function in `backend/server.js` to customize AI behavior or integrate with external AI services.

### Styling
- Chatbot styles: `frontend-chatbot/src/App.css`
- Reader styles: `chat-reader/src/App.css`
- Landing page: `html sample page/index.html` (inline styles)

### Configuration
- Backend port: Change `PORT` in `backend/server.js`
- Frontend ports: Modify `package.json` scripts or use different ports

## 🔒 Security Notes

- The current implementation is for development/demo purposes
- For production, add proper authentication and validation
- Consider using environment variables for sensitive configuration
- Implement rate limiting for API endpoints

## 🚀 Deployment

### Backend Deployment
1. Set up a Node.js hosting service (Heroku, Vercel, etc.)
2. Update CORS settings for production domain
3. Consider using a database instead of file storage for production

### Frontend Deployment
1. Build the React apps: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, etc.)
3. Update API URLs in the frontend code

## 🛠️ Development

### Adding New Features
1. Backend: Add new routes in `server.js`
2. Frontend: Create new components in respective React apps
3. Update API calls in frontend components

### Testing
- Backend: Test API endpoints with tools like Postman
- Frontend: Use React testing utilities
- Integration: Test the complete flow from landing page to chat

## 📝 License

MIT License - feel free to use this project for your own applications.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you encounter any issues or have questions, please create an issue in the repository.
