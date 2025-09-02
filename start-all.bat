@echo off
echo Starting AI Chatbot System...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm install && npm start"

timeout /t 3 /nobreak >nul

echo Starting React Chatbot...
start "React Chatbot" cmd /k "cd frontend-chatbot && npm install && npm start"

timeout /t 3 /nobreak >nul

echo Starting Chat Reader...
start "Chat Reader" cmd /k "cd chat-reader && npm install && npm start"

timeout /t 3 /nobreak >nul

echo.
echo All services are starting up...
echo.
echo Backend Server: http://localhost:5060
echo React Chatbot: http://localhost:3000
echo Chat Reader: http://localhost:3002
echo Landing Page: Open "html sample page/index.html" in your browser
echo.
echo Press any key to exit...
pause >nul
