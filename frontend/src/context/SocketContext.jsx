/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState(new Set())
  const { user, token } = useAuth()

  useEffect(() => {
    if (user) {
      const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      const newSocket = io(socketUrl, {
        withCredentials: true,
      })

      newSocket.on('connect', () => {
        setIsConnected(true)
        newSocket.emit('get_online_users')
      })

      newSocket.on('connect_error', error => {
        console.error('Socket connection error:', error)
      })

      newSocket.on('disconnect', () => {
        setIsConnected(false)
      })

      newSocket.on('user_online', ({ userId }) => {
        setOnlineUsers(prev => new Set([...prev, userId]))
      })

      newSocket.on('user_offline', ({ userId }) => {
        setOnlineUsers(prev => {
          const newSet = new Set(prev)
          newSet.delete(userId)
          return newSet
        })
      })

      newSocket.on('online_users', users => {
        setOnlineUsers(new Set(users.map(u => u._id.toString())))
      })

      setTimeout(() => setSocket(newSocket), 0)

      return () => {
        newSocket.disconnect()
        setSocket(null)
        setIsConnected(false)
      }
    }
  }, [user, token])

  const joinChat = useCallback(
    conversationId => {
      if (socket && isConnected) {
        socket.emit('join_chat', { conversationId })
      }
    },
    [socket, isConnected],
  )

  const leaveChat = useCallback(
    conversationId => {
      if (socket && isConnected) {
        socket.emit('leave_chat', { conversationId })
      }
    },
    [socket, isConnected],
  )

  const sendMessage = useCallback(
    (conversationId, content, attachments = [], sharedPost = null) => {
      if (socket && isConnected) {
        socket.emit('send_message', { conversationId, content, attachments, sharedPost })
      }
    },
    [socket, isConnected],
  )

  // Stable emit helpers
  const emitTyping = useCallback(
    conversationId => {
      if (socket && isConnected) {
        socket.emit('typing_start', { conversationId })
      }
    },
    [socket, isConnected],
  )

  const emitStopTyping = useCallback(
    conversationId => {
      if (socket && isConnected) {
        socket.emit('typing_stop', { conversationId })
      }
    },
    [socket, isConnected],
  )

  const emitMessageRead = useCallback(
    messageId => {
      if (socket && isConnected) {
        socket.emit('message_read', { messageId })
      }
    },
    [socket, isConnected],
  )

  const emitUpdateMessage = useCallback(
    (messageId, content) => {
      if (socket && isConnected) {
        socket.emit('update_message', { messageId, content })
      }
    },
    [socket, isConnected],
  )

  const emitDeleteMessage = useCallback(
    messageId => {
      if (socket && isConnected) {
        socket.emit('delete_message', { messageId })
      }
    },
    [socket, isConnected],
  )

  const emitNotificationRead = useCallback(
    notificationId => {
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
    callback => {
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
    callback => {
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
    callback => {
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
    callback => {
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
    callback => {
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
    callback => {
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
    callback => {
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
    callback => {
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

export const useSocket = () => useContext(SocketContext)
