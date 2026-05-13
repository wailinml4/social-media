/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Conversation } from '../types'
import type { ConversationsResponse } from '../types'
import { createConversation, getConversations, getConversation, markConversationAsRead } from '../services/conversationService.js'
import { useSocket } from './SocketContext.jsx'
import { useAuth } from './AuthContext.jsx'

interface ConversationContextValue {
  conversations: Conversation[]
  currentConversation: Conversation | null
  setCurrentConversation: (conv: Conversation | null) => void
  isLoadingConversations: boolean
  isCreatingConversation: boolean
  error: string | null
  fetchConversations: () => Promise<void>
  createNewConversation: (participants: string[]) => Promise<Conversation>
  fetchConversationById: (conversationId: string) => Promise<Conversation>
  selectConversation: (conversation: Conversation) => Promise<void>
  markAsRead: (conversationId: string) => Promise<void>
}

export const ConversationContext = createContext<ConversationContextValue | null>(null)

export const ConversationProvider = ({ children }: { children: ReactNode }) => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [isLoadingConversations, setIsLoadingConversations] = useState(false)
  const [isCreatingConversation, setIsCreatingConversation] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { user } = useAuth()
  const { isConnected, joinChat, leaveChat, onConversationUpdated, offConversationUpdated } = useSocket()

  const fetchConversations = useCallback(async () => {
    try {
      setIsLoadingConversations(true)
      setError(null)
      const result = await getConversations()
      setConversations(result.conversations || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversations')
      throw err
    } finally {
      setIsLoadingConversations(false)
    }
  }, [])

  const createNewConversation = useCallback(async (participants: string[]) => {
    try {
      setIsCreatingConversation(true)
      setError(null)
      const conversation = await createConversation(participants)
      setConversations(prev => [conversation, ...prev])
      return conversation
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create conversation')
      throw err
    } finally {
      setIsCreatingConversation(false)
    }
  }, [])

  const markAsRead = useCallback(
    async (conversationId: string) => {
      if (!user) return
      try {
        setError(null)
        await markConversationAsRead(conversationId)
        setConversations(prev =>
          prev.map(conv => (conv._id === conversationId ? { ...conv, unreadCount: { ...conv.unreadCount, [user._id]: 0 } } : conv)),
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to mark as read')
        throw err
      }
    },
    [user],
  )

  const fetchConversationById = useCallback(async (conversationId: string) => {
    try {
      const conversation = await getConversation(conversationId)
      return conversation
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }, [])

  const selectConversation = useCallback(
    async (conversation: Conversation) => {
      if (!conversation || !conversation._id) {
        return
      }
      setCurrentConversation(conversation)
      if (isConnected) {
        joinChat(conversation._id)
      }
    },
    [isConnected, joinChat],
  )

  // Listen for conversation updates
  useEffect(() => {
    if (isConnected) {
      onConversationUpdated((data: { conversation: Conversation } | Conversation) => {
        const conversation: Conversation = 'conversation' in data ? data.conversation : data
        if (!conversation || !conversation._id) {
          return
        }
        setConversations(prev => {
          const updated = prev.map(conv =>
            String(conv._id) === String(conversation._id)
              ? {
                  ...conv,
                  lastMessage: conversation.lastMessage,
                  unreadCount: conversation.unreadCount,
                  updatedAt: conversation.updatedAt,
                }
              : conv,
          )
          const updatedConv = updated.find(c => String(c._id) === String(conversation._id))
          if (updatedConv) {
            return [updatedConv, ...updated.filter(c => String(c._id) !== String(conversation._id))]
          }
          return updated
        })
      })

      return () => {
        offConversationUpdated()
      }
    }
  }, [isConnected, onConversationUpdated, offConversationUpdated])

  // Ensure we join the current conversation room when the socket connects
  useEffect(() => {
    if (isConnected && currentConversation && currentConversation._id) {
      joinChat(currentConversation._id)
    }
  }, [isConnected, currentConversation, joinChat])

  // Leave chat room when switching conversations
  useEffect(() => {
    return () => {
      if (currentConversation && isConnected && currentConversation._id) {
        leaveChat(currentConversation._id)
      }
    }
  }, [currentConversation, isConnected, leaveChat])

  // Fetch conversations on mount
  useEffect(() => {
    if (user) {
      setTimeout(() => {
        fetchConversations()
      }, 0)
    }
  }, [user, fetchConversations])

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        currentConversation,
        setCurrentConversation,
        isLoadingConversations,
        isCreatingConversation,
        error,
        fetchConversations,
        createNewConversation,
        fetchConversationById,
        selectConversation,
        markAsRead,
      }}
    >
      {children}
    </ConversationContext.Provider>
  )
}

export const useConversations = (): ConversationContextValue => {
  const context = useContext(ConversationContext)
  if (!context) {
    throw new Error('useConversations must be used within a ConversationProvider')
  }
  return context
}
