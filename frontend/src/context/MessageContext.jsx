/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import {
  createMessage,
  getMessages,
  updateMessage,
  deleteMessage,
} from '../services/messageService'
import { useSocket } from './SocketContext'
import { useAuth } from './AuthContext'
import { useConversations } from './ConversationContext'

export const MessageContext = createContext()

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([])
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const [typingUsers, setTypingUsers] = useState({})
  const [error, setError] = useState(null)

  const { user } = useAuth()
  const { currentConversation } = useConversations()
  const {
    isConnected,
    sendMessage: socketSendMessage,
    emitTyping,
    emitStopTyping,
    emitMessageRead,
    emitUpdateMessage,
    emitDeleteMessage,
    onMessage,
    offMessage,
    onTyping,
    offTyping,
    onStoppedTyping,
    offStoppedTyping,
    onMessageUpdated,
    offMessageUpdated,
    onMessageDeleted,
    offMessageDeleted,
    onMessageReadReceipt,
    offMessageReadReceipt,
  } = useSocket()

  const fetchMessages = useCallback(async conversationId => {
    try {
      setIsLoadingMessages(true)
      setError(null)
      const result = await getMessages(conversationId)
      setMessages(result.messages || [])
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setIsLoadingMessages(false)
    }
  }, [])

  const sendMessage = useCallback(
    async (conversationId, content, attachments = [], sharedPost = null) => {
      if (!user) return
      try {
        setIsSendingMessage(true)
        setError(null)

        // Send via socket for real-time delivery
        if (isConnected) {
          socketSendMessage(conversationId, content, attachments, sharedPost)
        } else {
          // Fallback to REST API
          const result = await createMessage(conversationId, content, attachments, sharedPost)
          setMessages(prev => [...prev, result.message])
        }
      } catch (error) {
        setError(error.message)
        throw error
      } finally {
        setIsSendingMessage(false)
      }
    },
    [isConnected, socketSendMessage, user],
  )

  const editMessage = useCallback(
    async (messageId, content) => {
      try {
        setError(null)
        // Use socket for real-time update
        if (isConnected) {
          emitUpdateMessage(messageId, content)
          // Optimistically update local state
          setMessages(prev =>
            prev.map(msg =>
              msg.id === messageId || msg._id === messageId ? { ...msg, content } : msg,
            ),
          )
        } else {
          // Fallback to REST API
          const result = await updateMessage(messageId, content)
          setMessages(prev =>
            prev.map(msg => (msg.id === messageId || msg._id === messageId ? result : msg)),
          )
        }
      } catch (error) {
        setError(error.message)
        throw error
      }
    },
    [isConnected, emitUpdateMessage],
  )

  const removeMessage = useCallback(
    async messageId => {
      try {
        setError(null)
        // Use socket for real-time delete
        if (isConnected) {
          emitDeleteMessage(messageId)
          // Optimistically update local state
          setMessages(prev => prev.filter(msg => msg.id !== messageId && msg._id !== messageId))
        } else {
          // Fallback to REST API
          await deleteMessage(messageId)
          setMessages(prev => prev.filter(msg => msg.id !== messageId && msg._id !== messageId))
        }
      } catch (error) {
        setError(error.message)
        throw error
      }
    },
    [isConnected, emitDeleteMessage],
  )

  // Listen for real-time messages
  useEffect(() => {
    if (isConnected) {
      onMessage(data => {
        const { message } = data

        // Add message to current conversation if it matches
        if (
          currentConversation &&
          (message.conversation === currentConversation.id ||
            message.conversation === currentConversation._id)
        ) {
          setMessages(prev => [...prev, message])
        }
      })

      return () => {
        offMessage()
      }
    }
  }, [isConnected, onMessage, offMessage, currentConversation])

  // Listen for typing indicators
  useEffect(() => {
    if (isConnected) {
      onTyping(({ userId, conversationId }) => {
        setTypingUsers(prev => ({
          ...prev,
          [conversationId]: [...new Set([...(prev[conversationId] || []), userId])],
        }))
      })

      onStoppedTyping(({ userId, conversationId }) => {
        setTypingUsers(prev => ({
          ...prev,
          [conversationId]: (prev[conversationId] || []).filter(id => id !== userId),
        }))
      })

      return () => {
        offTyping()
        offStoppedTyping()
      }
    }
  }, [isConnected, onTyping, offTyping, onStoppedTyping, offStoppedTyping])

  // Listen for message updates
  useEffect(() => {
    if (isConnected) {
      onMessageUpdated(message => {
        setMessages(prev =>
          prev.map(msg => (msg.id === message.id || msg._id === message._id ? message : msg)),
        )
      })

      onMessageDeleted(({ messageId }) => {
        setMessages(prev => prev.filter(msg => msg.id !== messageId && msg._id !== messageId))
      })

      onMessageReadReceipt(({ messageId, userId }) => {
        setMessages(prev =>
          prev.map(msg => {
            if (msg.id === messageId || msg._id === messageId) {
              const readBy = msg.readBy || []
              if (!readBy.includes(userId)) {
                return { ...msg, readBy: [...readBy, userId] }
              }
            }
            return msg
          }),
        )
      })

      return () => {
        offMessageUpdated()
        offMessageDeleted()
        offMessageReadReceipt()
      }
    }
  }, [
    isConnected,
    onMessageUpdated,
    offMessageUpdated,
    onMessageDeleted,
    offMessageDeleted,
    onMessageReadReceipt,
    offMessageReadReceipt,
  ])

  // Clear messages when conversation changes
  useEffect(() => {
    setTimeout(() => setMessages([]), 0)
  }, [currentConversation])

  return (
    <MessageContext.Provider
      value={{
        messages,
        isLoadingMessages,
        isSendingMessage,
        typingUsers,
        error,
        fetchMessages,
        sendMessage,
        editMessage,
        removeMessage,
        emitTyping,
        emitStopTyping,
        emitMessageRead,
      }}
    >
      {children}
    </MessageContext.Provider>
  )
}

export const useMessages = () => useContext(MessageContext)
