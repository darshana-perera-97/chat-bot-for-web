# ChatBot Integration Project

This project demonstrates how to create and integrate a chatbot in both React.js and vanilla HTML/JavaScript.

## Project Structure

```
├── chatbot/                 # React.js chatbot application
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatBot.js   # Main chatbot component
│   │   │   └── ChatBot.css  # Chatbot styles
│   │   └── App.js           # Main React app
│   └── package.json
├── html page/
│   └── index.html           # Standalone HTML page with integrated chatbot
└── backend/                 # Backend server (optional)
```

## Features

### 🤖 ChatBot Capabilities
- **Smart Responses**: Context-aware responses to common queries
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Mobile Friendly**: Works perfectly on desktop and mobile devices
- **Real-time Chat**: Instant message sending and receiving
- **Auto-scroll**: Automatically scrolls to latest messages

### 💬 Supported Interactions
- Greetings (hello, hi)
- Help requests
- Weather inquiries
- Time requests
- Thank you responses
- Goodbye messages
- General conversation

## Usage

### Backend Server Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:3333`

### Option 1: React.js Application

1. Navigate to the chatbot directory:
   ```bash
   cd chatbot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and go to `http://localhost:3000`

### Option 2: Standalone HTML Page

1. Make sure the backend server is running on port 3333
2. Open the `html page/index.html` file directly in your browser
3. Click the chat button in the bottom-right corner
4. Start chatting with the AI assistant

## Customization

### Adding New Responses

To add new bot responses, modify the `getBotResponse` function in:
- `backend/index.js` (Backend server)

Example:
```javascript
const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('your_keyword')) {
        return "Your custom response here!";
    }
    // ... existing responses
};
```

### Styling

- **React version**: Modify `chatbot/src/components/ChatBot.css`
- **HTML version**: Modify the `<style>` section in `html page/index.html`

## Technical Details

### Backend Implementation
- **Express.js**: Web framework for Node.js
- **CORS**: Cross-origin resource sharing enabled
- **RESTful API**: JSON-based communication
- **Error Handling**: Graceful error handling with fallbacks
- **Health Monitoring**: Health check endpoints

### React Implementation
- Built with React 19.1.1
- Uses functional components with hooks
- Responsive design with CSS Grid and Flexbox
- Smooth animations and transitions
- **API Integration**: Communicates with backend server

### HTML Implementation
- Vanilla JavaScript
- CSS3 animations and transitions
- Mobile-responsive design
- **API Integration**: Communicates with backend server

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Future Enhancements

- [ ] Backend integration for persistent conversations
- [ ] User authentication
- [ ] File upload support
- [ ] Voice message support
- [ ] Multi-language support
- [ ] Advanced AI integration (OpenAI, etc.)

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.
