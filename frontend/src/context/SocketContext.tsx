/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import env from '../config/env'
import type { User, MessageAttachment, SharedPost } from '../types'
import type {
  MessageReceivedCallback,
  MessageUpdatedCallback,
  MessageDeletedCallback,
  MessageReadReceiptCallback,
  TypingCallback,
  NotificationCallback,
  ConversationUpdatedCallback,
  SendMessagePayload,
} from '../types'
import { useAuth } from './AuthContext.jsx'

interface SocketContextValue {
  socket: Socket | null
  isConnected: boolean
  onlineUsers: Set<string>
  joinChat: (conversationId: string) => void
  leaveChat: (conversationId: string) => void
  sendMessage: (conversationId: string, content: string, attachments: MessageAttachment[], sharedPost: SharedPost | null) => void
  emitTyping: (conversationId: string) => void
  emitStopTyping: (conversationId: string) => void
  emitMessageRead: (messageId: string) => void
  emitUpdateMessage: (messageId: string, content: string) => void
  emitDeleteMessage: (messageId: string) => void
  onMessage: (callback: MessageReceivedCallback) => void
  offMessage: () => void
  onTyping: (callback: (data: { userId: string; conversationId: string }) => void) => void
  offTyping: () => void
  onStoppedTyping: (callback: (data: { userId: string; conversationId: string }) => void) => void
  offStoppedTyping: () => void
  onMessageUpdated: (callback: MessageUpdatedCallback) => void
  offMessageUpdated: () => void
  onMessageDeleted: (callback: (data: { messageId: string }) => void) => void
  offMessageDeleted: () => void
  onMessageReadReceipt: (callback: (data: { messageId: string; userId: string }) => void) => void
  offMessageReadReceipt: () => void
  onNotification: (callback: NotificationCallback) => void
  offNotification: () => void
  onConversationUpdated: (callback: ConversationUpdatedCallback) => void
  offConversationUpdated: () => void
}

const SocketContext = createContext<SocketContextValue | null>(null)

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      const socketUrl = env.VITE_BACKEND_URL
      const newSocket = io(socketUrl, {
        withCredentials: true,
      })

      newSocket.on('connect', () => {
        setIsConnected(true)
        newSocket.emit('get_online_users')
      })

      newSocket.on('connect_error', (error: Error) => {
        console.error('Socket connection error:', error)
      })

      newSocket.on('disconnect', () => {
        setIsConnected(false)
      })

      newSocket.on('user_online', ({ userId }: { userId: string }) => {
        setOnlineUsers(prev => new Set([...prev, userId]))
      })

      newSocket.on('user_offline', ({ userId }: { userId: string }) => {
        setOnlineUsers(prev => {
          const newSet = new Set(prev)
          newSet.delete(userId)
          return newSet
        })
      })

      newSocket.on('online_users', (users: User[]) => {
        setOnlineUsers(new Set(users.map(u => u._id.toString())))
      })

      setTimeout(() => setSocket(newSocket), 0)

      return () => {
        newSocket.disconnect()
        setSocket(null)
        setIsConnected(false)
      }
    }
  }, [user])

  const joinChat = useCallback(
    (conversationId: string) => {
      if (socket && isConnected) {
        socket.emit('join_chat', { conversationId })
      }
    },
    [socket, isConnected],
  )

  const leaveChat = useCallback(
    (conversationId: string) => {
      if (socket && isConnected) {
        socket.emit('leave_chat', { conversationId })
      }
    },
    [socket, isConnected],
  )

  const sendMessage = useCallback(
    (conversationId: string, content: string, attachments: MessageAttachment[] = [], sharedPost: SharedPost | null = null) => {
      if (socket && isConnected) {
        socket.emit('send_message', { conversationId, content, attachments, sharedPost })
      }
    },
    [socket, isConnected],
  )

  // Stable emit helpers
  const emitTyping = useCallback(
    (conversationId: string) => {
      if (socket && isConnected) {
        socket.emit('typing_start', { conversationId })
      }
    },
    [socket, isConnected],
  )

  const emitStopTyping = useCallback(
    (conversationId: string) => {
      if (socket && isConnected) {
        socket.emit('typing_stop', { conversationId })
      }
    },
    [socket, isConnected],
  )

  const emitMessageRead = useCallback(
    (messageId: string) => {
      if (socket && isConnected) {
        socket.emit('message_read', { messageId })
      }
    },
    [socket, isConnected],
  )

  const emitUpdateMessage = useCallback(
    (messageId: string, content: string) => {
      if (socket && isConnected) {
        socket.emit('update_message', { messageId, content })
      }
    },
    [socket, isConnected],
  )

  const emitDeleteMessage = useCallback(
    (messageId: string) => {
      if (socket && isConnected) {
        socket.emit('delete_message', { messageId })
      }
    },
    [socket, isConnected],
  )

  const emitNotificationRead = useCallback(
    (notificationId: string) => {
      if (socket && isConnected) {
        socket.emit('notification_read', { notificationId })
      }
    },
    [socket, isConnected],
  )

  const getOnlineUsers = useCallback(() => {
    if (socket && isConnected) {
      socket.emit('get_online_users')
    }
  }, [socket, isConnected])
  const onMessage = useCallback(
    (callback: MessageReceivedCallback) => {
      if (socket) {
        socket.on('message_received', callback)
      }
    },
    [socket],
  )

  const offMessage = useCallback(() => {
    if (socket) {
      socket.off('message_received')
    }
  }, [socket])

  const onTyping = useCallback(
    (callback: (data: { userId: string; conversationId: string }) => void) => {
      if (socket) {
        socket.on('user_typing', callback)
      }
    },
    [socket],
  )

  const offTyping = useCallback(() => {
    if (socket) {
      socket.off('user_typing')
    }
  }, [socket])

  const onStoppedTyping = useCallback(
    (callback: (data: { userId: string; conversationId: string }) => void) => {
      if (socket) {
        socket.on('user_stopped_typing', callback)
      }
    },
    [socket],
  )

  const offStoppedTyping = useCallback(() => {
    if (socket) {
      socket.off('user_stopped_typing')
    }
  }, [socket])

  const onMessageUpdated = useCallback(
    (callback: MessageUpdatedCallback) => {
      if (socket) {
        socket.on('message_updated', callback)
      }
    },
    [socket],
  )

  const offMessageUpdated = useCallback(() => {
    if (socket) {
      socket.off('message_updated')
    }
  }, [socket])

  const onMessageDeleted = useCallback(
    (callback: (data: { messageId: string }) => void) => {
      if (socket) {
        socket.on('message_deleted', callback)
      }
    },
    [socket],
  )

  const offMessageDeleted = useCallback(() => {
    if (socket) {
      socket.off('message_deleted')
    }
  }, [socket])

  const onMessageReadReceipt = useCallback(
    (callback: (data: { messageId: string; userId: string }) => void) => {
      if (socket) {
        socket.on('message_read_receipt', callback)
      }
    },
    [socket],
  )

  const offMessageReadReceipt = useCallback(() => {
    if (socket) {
      socket.off('message_read_receipt')
    }
  }, [socket])

  const onNotification = useCallback(
    (callback: NotificationCallback) => {
      if (socket) {
        socket.on('notification', callback)
      }
    },
    [socket],
  )

  const offNotification = useCallback(() => {
    if (socket) {
      socket.off('notification')
    }
  }, [socket])

  const onConversationUpdated = useCallback(
    (callback: ConversationUpdatedCallback) => {
      if (socket) {
        socket.on('conversation_updated', callback)
      }
    },
    [socket],
  )

  const offConversationUpdated = useCallback(() => {
    if (socket) {
      socket.off('conversation_updated')
    }
  }, [socket])

  const value = useMemo(
    () => ({
      socket,
      isConnected,
      onlineUsers,
      joinChat,
      leaveChat,
      sendMessage,
      emitTyping,
      emitStopTyping,
      emitMessageRead,
      emitUpdateMessage,
      emitDeleteMessage,
      emitNotificationRead,
      getOnlineUsers,
      onMessage,
      offMessage,
      onTyping,
      offTyping,
      onStoppedTyping,
      offStoppedTyping,
      onNotification,
      offNotification,
      onConversationUpdated,
      offConversationUpdated,
      onMessageReadReceipt,
      offMessageReadReceipt,
      onMessageUpdated,
      offMessageUpdated,
      onMessageDeleted,
      offMessageDeleted,
    }),
    [
      socket,
      isConnected,
      onlineUsers,
      joinChat,
      leaveChat,
      sendMessage,
      emitTyping,
      emitStopTyping,
      emitMessageRead,
      emitUpdateMessage,
      emitDeleteMessage,
      emitNotificationRead,
      getOnlineUsers,
      onMessage,
      offMessage,
      onTyping,
      offTyping,
      onStoppedTyping,
      offStoppedTyping,
      onNotification,
      offNotification,
      onConversationUpdated,
      offConversationUpdated,
      onMessageReadReceipt,
      offMessageReadReceipt,
      onMessageUpdated,
      offMessageUpdated,
      onMessageDeleted,
      offMessageDeleted,
    ],
  )

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

export const useSocket = (): SocketContextValue => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}
