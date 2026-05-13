import { Server } from 'socket.io'
import type { Server as HttpServer } from 'http'
import type { Socket } from 'socket.io'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { handleConnection } from './handlers/connection.js'
import { handleChatEvents } from './handlers/chat.js'
import { handleNotificationEvents } from './handlers/notification.js'
import { handlePresenceEvents } from './handlers/presence.js'
import env from '../config/env.js'

let io: Server

export const initializeSocket = (server: HttpServer) => {
  if (env.NODE_ENV === 'production') {
    io = new Server(server, {
      cors: {
        origin: [env.FRONTEND_URL, /\.vercel\.app$/],
        credentials: true,
        methods: ['GET', 'POST'],
      },
    })
  } else {
    io = new Server(server, {
      cors: {
        origin: true,
        credentials: true,
        methods: ['GET', 'POST'],
      },
    })
  }

  // Authentication middleware
  io.use(async (socket: Socket, next: (err?: Error) => void) => {
    try {
      // Try to get token from cookies first, then from auth object
      const token = socket.handshake.headers.cookie?.match(/token=([^;]+)/)?.[1] || socket.handshake.auth.token

      if (!token) {
        return next(new Error('Authentication error: No token provided'))
      }

      const secret = env.JWT_SECRET
      if (!secret) {
        return next(new Error('Authentication error: JWT_SECRET not configured'))
      }

      const decoded = jwt.verify(token, secret)
      if (typeof decoded === 'string' || !('userId' in decoded) || typeof decoded.userId !== 'string') {
        return next(new Error('Authentication error: Invalid token payload'))
      }

      const user = await User.findById(decoded.userId).select('-password')

      if (!user) {
        return next(new Error('Authentication error: User not found'))
      }

      socket.user = user
      socket.userId = user._id.toString()
      next()
    } catch {
      next(new Error('Authentication error: Invalid token'))
    }
  })

  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.userId}`)

    // Handle connection/disconnection
    handleConnection(io, socket)

    // Handle chat events
    handleChatEvents(io, socket)

    // Handle notification events
    handleNotificationEvents(io, socket)

    // Handle presence events
    handlePresenceEvents(io, socket)
  })

  return io
}

