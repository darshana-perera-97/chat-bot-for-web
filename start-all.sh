#!/bin/bash

echo "Starting AI Chatbot System..."
echo

echo "Starting Backend Server..."
gnome-terminal -- bash -c "cd backend && npm install && npm start; exec bash" &

sleep 3

echo "Starting React Chatbot..."
gnome-terminal -- bash -c "cd frontend-chatbot && npm install && npm start; exec bash" &

sleep 3

echo "Starting Chat Reader..."
gnome-terminal -- bash -c "cd chat-reader && npm install && npm start; exec bash" &

sleep 3

echo
echo "All services are starting up..."
echo
echo "Backend Server: http://localhost:5060"
echo "React Chatbot: http://localhost:3000"
echo "Chat Reader: http://localhost:3002"
echo "Landing Page: Open 'html sample page/index.html' in your browser"
echo
echo "Press any key to exit..."
read -n 1
