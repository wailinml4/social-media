import { createMessageService } from '../../services/messageService.js'
import { markMessageAsReadService } from '../../services/messageService.js'

export const handleChatEvents = (io, socket) => {
  // Join a conversation room
  socket.on('join_chat', ({ conversationId }) => {
    socket.join(`chat:${conversationId}`)
    console.log(`User ${socket.userId} joined chat:${conversationId}`)
  })

  // Leave a conversation room
  socket.on('leave_chat', ({ conversationId }) => {
    socket.leave(`chat:${conversationId}`)
    console.log(`User ${socket.userId} left chat:${conversationId}`)
  })

  // Send a message
  socket.on('send_message', async ({ conversationId, content, attachments, sharedPost }) => {
    try {
      const result = await createMessageService(
        socket.userId,
        conversationId,
        content,
        attachments,
        sharedPost,
      )

      // Emit to all users in the conversation room
      io.to(`chat:${conversationId}`).emit('message_received', result)

      // Also emit a conversation update so conversation lists update in real-time
      try {
        io.to(`chat:${conversationId}`).emit('conversation_updated', result.conversation)

        // Emit to all participants (use unreadCount keys as participant ids) and sender
        const participantIds =
          result.conversation && result.conversation.unreadCount
            ? Object.keys(result.conversation.unreadCount)
            : []

        participantIds.forEach(participantId => {
          io.to(`user:${participantId}`).emit('conversation_updated', result.conversation)
        })

        // Ensure sender also receives the update on their user room
        io.to(`user:${socket.userId}`).emit('conversation_updated', result.conversation)
      } catch (err) {
        console.error('Error emitting conversation update:', err)
      }

      // Emit notification events to recipients of the message
      if (result.notifications && Array.isArray(result.notifications)) {
        result.notifications.forEach(({ recipientId, notification }) => {
          io.to(`user:${recipientId}`).emit('notification', notification)
        })
      }
    } catch (error) {
      console.error('Error sending message:', error)
      socket.emit('error', { message: 'Failed to send message' })
    }
  })

  // Typing indicator start
  socket.on('typing_start', ({ conversationId }) => {
    socket.to(`chat:${conversationId}`).emit('user_typing', {
      userId: socket.userId,
      conversationId,
    })
  })

  // Typing indicator stop
  socket.on('typing_stop', ({ conversationId }) => {
    socket.to(`chat:${conversationId}`).emit('user_stopped_typing', {
      userId: socket.userId,
      conversationId,
    })
  })

  // Mark message as read
  socket.on('message_read', async ({ messageId }) => {
    try {
      const message = await markMessageAsReadService(messageId, socket.userId)

      // Emit to sender that message was read
      if (message.sender._id.toString() !== socket.userId) {
        io.to(`user:${message.sender._id}`).emit('message_read_receipt', {
          messageId,
          userId: socket.userId,
        })
      }
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  })

  // Update message
  socket.on('update_message', async ({ messageId, content }) => {
    try {
      const { updateMessageService } = await import('../../services/messageService.js')
      const message = await updateMessageService(messageId, socket.userId, { content })

      // Emit to all users in the conversation room
      io.to(`chat:${message.conversation}`).emit('message_updated', message)
    } catch (error) {
      console.error('Error updating message:', error)
      socket.emit('error', { message: 'Failed to update message' })
    }
  })

  // Delete message
  socket.on('delete_message', async ({ messageId }) => {
    try {
      const { deleteMessageService } = await import('../../services/messageService.js')
      const { conversationId } = await deleteMessageService(messageId, socket.userId)

      // Emit to all users in the conversation room
      io.to(`chat:${conversationId}`).emit('message_deleted', { messageId })
    } catch (error) {
      console.error('Error deleting message:', error)
      socket.emit('error', { message: 'Failed to delete message' })
    }
  })
}
