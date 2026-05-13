import type { Server, Socket } from 'socket.io'
import { createMessageService } from '../../services/messageService.js'
import { markMessageAsReadService } from '../../services/messageService.js'

interface JoinLeavePayload {
  conversationId: string
}
interface SendMessagePayload {
  conversationId: string
  content?: string
  attachments?: object[]
  sharedPost?: object
}
interface TypingPayload {
  conversationId: string
}
interface MessageReadPayload {
  messageId: string
}
interface UpdateMessagePayload {
  messageId: string
  content: string
}
interface DeleteMessagePayload {
  messageId: string
}

export const handleChatEvents = (io: Server, socket: Socket) => {
  // Join a conversation room
  socket.on('join_chat', ({ conversationId }: JoinLeavePayload) => {
    socket.join(`chat:${conversationId}`)
    console.log(`User ${socket.userId} joined chat:${conversationId}`)
  })

  // Leave a conversation room
  socket.on('leave_chat', ({ conversationId }: JoinLeavePayload) => {
    socket.leave(`chat:${conversationId}`)
    console.log(`User ${socket.userId} left chat:${conversationId}`)
  })

  // Send a message
  socket.on('send_message', async ({ conversationId, content, attachments, sharedPost }: SendMessagePayload) => {
    try {
      const result = await createMessageService({
        senderId: socket.userId ?? '',
        conversationId,
        content,
        attachments,
        sharedPost,
      })

      // Emit to all users in the conversation room
      io.to(`chat:${conversationId}`).emit('message_received', result)

      // Also emit a conversation update so conversation lists update in real-time
      try {
        io.to(`chat:${conversationId}`).emit('conversation_updated', result.conversation)

        // Emit to all participants (use unreadCount keys as participant ids) and sender
        const participantIds = result.conversation && result.conversation.unreadCount ? Object.keys(result.conversation.unreadCount) : []

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
        result.notifications
          .filter((n): n is NonNullable<typeof n> => n !== null)
          .forEach(({ recipientId, notification }) => {
            io.to(`user:${recipientId}`).emit('notification', notification)
          })
      }
    } catch (error) {
      console.error('Error sending message:', error)
      socket.emit('error', { message: 'Failed to send message' })
    }
  })

  // Typing indicator start
  socket.on('typing_start', ({ conversationId }: TypingPayload) => {
    socket.to(`chat:${conversationId}`).emit('user_typing', {
      userId: socket.userId,
      conversationId,
    })
  })

  // Typing indicator stop
  socket.on('typing_stop', ({ conversationId }: TypingPayload) => {
    socket.to(`chat:${conversationId}`).emit('user_stopped_typing', {
      userId: socket.userId,
      conversationId,
    })
  })

  // Mark message as read
  socket.on('message_read', async ({ messageId }: MessageReadPayload) => {
    try {
      const message = await markMessageAsReadService({ messageId, userId: socket.userId ?? '' })

      // Emit to sender that message was read
      const senderId = message.sender ? String(message.sender._id) : null
      if (senderId && senderId !== socket.userId) {
        io.to(`user:${senderId}`).emit('message_read_receipt', {
          messageId,
          userId: socket.userId,
        })
      }
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  })

  // Update message
  socket.on('update_message', async ({ messageId, content }: UpdateMessagePayload) => {
    try {
      const { updateMessageService } = await import('../../services/messageService.js')
      const message = await updateMessageService({ messageId, userId: socket.userId ?? '', data: { content } })

      // Emit to all users in the conversation room
      io.to(`chat:${String(message.conversation)}`).emit('message_updated', { message })
    } catch (error) {
      console.error('Error updating message:', error)
      socket.emit('error', { message: 'Failed to update message' })
    }
  })

  // Delete message
  socket.on('delete_message', async ({ messageId }: DeleteMessagePayload) => {
    try {
      const { deleteMessageService } = await import('../../services/messageService.js')
      const { conversationId } = await deleteMessageService({ messageId, userId: socket.userId ?? '' })

      // Emit to all users in the conversation room
      io.to(`chat:${conversationId}`).emit('message_deleted', { messageId })
    } catch (error) {
      console.error('Error deleting message:', error)
      socket.emit('error', { message: 'Failed to delete message' })
    }
  })
}
