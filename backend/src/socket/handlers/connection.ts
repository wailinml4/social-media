import type { Server, Socket } from 'socket.io'
import User from '../../models/User.js'

export const handleConnection = (io: Server, socket: Socket) => {
  // Join user's personal room for direct notifications
  socket.join(`user:${socket.userId}`)

  // Set user as online
  User.findByIdAndUpdate(socket.userId, {
    isOnline: true,
    lastSeen: new Date(),
  }).catch((error: Error) => {
    console.error('Error setting user online:', error)
  })

  // Broadcast to online room that user is online
  io.to('online').emit('user_online', {
    userId: socket.userId,
  })

  // Join online room
  socket.join('online')

  socket.on('disconnect', async () => {
    console.log(`User disconnected: ${socket.userId}`)

    // Set user as offline
    await User.findByIdAndUpdate(socket.userId, {
      isOnline: false,
      lastSeen: new Date(),
    }).catch((error: Error) => {
      console.error('Error setting user offline:', error)
    })

    // Broadcast to online room that user is offline
    io.to('online').emit('user_offline', {
      userId: socket.userId,
    })

    // Leave all rooms
    socket.leave(`user:${socket.userId}`)
    socket.leave('online')
  })
}
