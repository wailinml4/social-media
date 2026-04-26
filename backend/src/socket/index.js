import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { handleConnection } from './handlers/connection.js';
import { handleChatEvents } from './handlers/chat.js';
import { handleNotificationEvents } from './handlers/notification.js';
import { handlePresenceEvents } from './handlers/presence.js';

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST'],
    },
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      // Try to get token from cookies first, then from auth object
      const token = socket.handshake.headers.cookie?.match(/token=([^;]+)/)?.[1] || socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.user = user;
      socket.userId = user._id.toString();
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Handle connection/disconnection
    handleConnection(io, socket);

    // Handle chat events
    handleChatEvents(io, socket);

    // Handle notification events
    handleNotificationEvents(io, socket);

    // Handle presence events
    handlePresenceEvents(io, socket);
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};
