/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import {
  createConversation,
  getConversations,
  getConversation,
  markConversationAsRead,
} from '../services/conversationService'
import { useSocket } from './SocketContext'
import { useAuth } from './AuthContext'

export const ConversationContext = createContext()

export const ConversationProvider = ({ children }) => {
  const [conversations, setConversations] = useState([])
  const [currentConversation, setCurrentConversation] = useState(null)
  const [isLoadingConversations, setIsLoadingConversations] = useState(false)
  const [isCreatingConversation, setIsCreatingConversation] = useState(false)
  const [error, setError] = useState(null)

  const { user } = useAuth()
  const { isConnected, joinChat, leaveChat, onConversationUpdated, offConversationUpdated } =
    useSocket()

  const fetchConversations = useCallback(async () => {
    try {
      setIsLoadingConversations(true)
      setError(null)
      const result = await getConversations()
      setConversations(result.conversations || [])
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setIsLoadingConversations(false)
    }
  }, [])

  const createNewConversation = useCallback(async participants => {
    try {
      setIsCreatingConversation(true)
      setError(null)
      const conversation = await createConversation(participants)
      setConversations(prev => [conversation, ...prev])
      return conversation
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setIsCreatingConversation(false)
    }
  }, [])

  const markAsRead = useCallback(
    async conversationId => {
      if (!user) return
      try {
        setError(null)
        await markConversationAsRead(conversationId)
        setConversations(prev =>
          prev.map(conv =>
            conv.id === conversationId || conv._id === conversationId
              ? { ...conv, unreadCount: { ...conv.unreadCount, [user._id]: 0 } }
              : conv,
          ),
        )
      } catch (error) {
        setError(error.message)
        throw error
      }
    },
    [user],
  )

  const fetchConversationById = useCallback(async conversationId => {
    try {
      const conversation = await getConversation(conversationId)
      return conversation
    } catch (error) {
      setError(error.message)
      throw error
    }
  }, [])

  const selectConversation = useCallback(
    async conversation => {
      setCurrentConversation(conversation)
      if (isConnected) {
        joinChat(conversation.id || conversation._id)
      }
    },
    [isConnected, joinChat],
  )

  // Fetch messages when conversation changes (this will be handled by MessageContext)
  // We just set the currentConversation here

  // Listen for conversation updates
  useEffect(() => {
    if (isConnected) {
      onConversationUpdated(conversation => {
        setConversations(prev => {
          const updated = prev.map(conv =>
            conv.id === conversation.id || conv._id === conversation._id
              ? {
                  ...conv,
                  lastMessage: conversation.lastMessage,
                  unreadCount: conversation.unreadCount,
                  updatedAt: conversation.updatedAt,
                }
              : conv,
          )
          const updatedConv = updated.find(
            c => c.id === conversation.id || c._id === conversation._id,
          )
          if (updatedConv) {
            return [
              updatedConv,
              ...updated.filter(c => c.id !== conversation.id && c._id !== conversation._id),
            ]
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
    if (isConnected && currentConversation) {
      joinChat(currentConversation.id || currentConversation._id)
    }
  }, [isConnected, currentConversation, joinChat])

  // Leave chat room when switching conversations
  useEffect(() => {
    return () => {
      if (currentConversation && isConnected) {
        leaveChat(currentConversation.id || currentConversation._id)
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

export const useConversations = () => useContext(ConversationContext)
