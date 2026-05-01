import { markAsReadService } from "../../services/notificationService.js"

export const handleNotificationEvents = (io, socket) => {
  // Mark notification as read
  socket.on('notification_read', async ({ notificationId }) => {
    try {
      await markAsReadService(notificationId, socket.userId)
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  })
}

