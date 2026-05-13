import type { Server, Socket } from 'socket.io'
import { markAsReadService } from '../../services/notificationService.js'

export const handleNotificationEvents = (io: Server, socket: Socket) => {
  // Mark notification as read
  socket.on('notification_read', async ({ notificationId }: { notificationId: string }) => {
    try {
      await markAsReadService({ notificationId, userId: socket.userId ?? '' })
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  })
}
