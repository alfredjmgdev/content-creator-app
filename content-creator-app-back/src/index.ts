import 'reflect-metadata';
import app, { initializeSocket } from './app';
import { createServer } from 'http';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 3000;

// Create HTTP server
const httpServer = createServer(app);

// Create Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Your React app URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// Initialize socket service
initializeSocket(io);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Listen on HTTP server instead of app
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
