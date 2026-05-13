/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Message } from '../types'
import type { MessageAttachment, SharedPostPayload } from '../types'
import { createMessage, getMessages, updateMessage, deleteMessage } from '../services/messageService.js'
import { useSocket } from './SocketContext.jsx'
import { useAuth } from './AuthContext.jsx'
import { useConversations } from './ConversationContext.jsx'

interface MessageContextValue {
  messages: Message[]
  isLoadingMessages: boolean
  isSendingMessage: boolean
  typingUsers: Record<string, string[]>
  error: string | null
  fetchMessages: (conversationId: string) => Promise<void>
  sendMessage: (
    conversationId: string,
    content: string,
    attachments?: MessageAttachment[],
    sharedPost?: SharedPostPayload | null,
  ) => Promise<void>
  editMessage: (messageId: string, content: string) => Promise<void>
  removeMessage: (messageId: string) => Promise<void>
  emitTyping: (conversationId: string) => void
  emitStopTyping: (conversationId: string) => void
  emitMessageRead: (messageId: string) => void
}

export const MessageContext = createContext<MessageContextValue | null>(null)

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({})
  const [error, setError] = useState<string | null>(null)

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

  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      setIsLoadingMessages(true)
      setError(null)
      const result = await getMessages(conversationId)
      setMessages(result.messages || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages')
      throw err
    } finally {
      setIsLoadingMessages(false)
    }
  }, [])

  const sendMessage = useCallback(
    async (conversationId: string, content: string, attachments: MessageAttachment[] = [], sharedPost: SharedPostPayload | null = null) => {
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
          setMessages(prev => [...prev, result])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to send message')
        throw err
      } finally {
        setIsSendingMessage(false)
      }
    },
    [isConnected, socketSendMessage, user],
  )

  const editMessage = useCallback(
    async (messageId: string, content: string) => {
      try {
        setError(null)
        // Use socket for real-time update
        if (isConnected) {
          emitUpdateMessage(messageId, content)
          // Optimistically update local state
          setMessages(prev => prev.map(msg => (msg._id === messageId ? { ...msg, content } : msg)))
        } else {
          // Fallback to REST API
          const result = await updateMessage(messageId, content)
          setMessages(prev => prev.map(msg => (msg._id === messageId ? result : msg)))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to edit message')
        throw err
      }
    },
    [isConnected, emitUpdateMessage],
  )

  const removeMessage = useCallback(
    async (messageId: string) => {
      try {
        setError(null)
        // Use socket for real-time delete
        if (isConnected) {
          emitDeleteMessage(messageId)
          // Optimistically update local state
          setMessages(prev => prev.filter(msg => msg._id !== messageId))
        } else {
          // Fallback to REST API
          await deleteMessage(messageId)
          setMessages(prev => prev.filter(msg => msg._id !== messageId))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete message')
        throw err
      }
    },
    [isConnected, emitDeleteMessage],
  )

  // Listen for real-time messages
  useEffect(() => {
    if (isConnected) {
      onMessage((data: { message: Message }) => {
        const { message } = data

        // Add message to current conversation if it matches
        if (
          currentConversation &&
          (message.conversation === currentConversation._id ||
            (typeof message.conversation === 'string' && message.conversation === currentConversation._id))
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
      onTyping(({ userId, conversationId }: { userId: string; conversationId: string }) => {
        setTypingUsers(prev => ({
          ...prev,
          [conversationId]: [...new Set([...(prev[conversationId] || []), userId])],
        }))
      })

      onStoppedTyping(({ userId, conversationId }: { userId: string; conversationId: string }) => {
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
      onMessageUpdated((data: { message: Message }) => {
        const { message } = data
        setMessages(prev => prev.map(msg => (msg._id === message._id ? message : msg)))
      })

      onMessageDeleted(({ messageId }: { messageId: string }) => {
        setMessages(prev => prev.filter(msg => msg._id !== messageId))
      })

      onMessageReadReceipt(({ messageId, userId }: { messageId: string; userId: string }) => {
        setMessages(prev =>
          prev.map(msg => {
            if (msg._id === messageId) {
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
  }, [isConnected, onMessageUpdated, offMessageUpdated, onMessageDeleted, offMessageDeleted, onMessageReadReceipt, offMessageReadReceipt])

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

export const useMessages = (): MessageContextValue => {
  const context = useContext(MessageContext)
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider')
  }
  return context
}
