import type { Server, Socket } from 'socket.io'
import User from '../../models/User.js'

export const handlePresenceEvents = (io: Server, socket: Socket) => {
  // Get list of online users
  socket.on('get_online_users', async () => {
    try {
      const onlineUsers = await User.find({ isOnline: true }).select('_id fullName email profilePicture').lean()

      socket.emit('online_users', onlineUsers)
    } catch (error) {
      console.error('Error getting online users:', error)
    }
  })
}
