import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import type { Conversation, User } from '../types'

import ChatSidebar from '../components/chat/ChatSidebar.jsx'
import ChatWindow from '../components/chat/ChatWindow.jsx'
import { useConversations } from '../context/ConversationContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const Messages = () => {
  const { userId, conversationId } = useParams()
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [isMobileListVisible, setIsMobileListVisible] = useState(true)
  const [isChatListCollapsed, setIsChatListCollapsed] = useState(false)
  const isCreatingConversationRef = useRef(false)

  const { user } = useAuth()
  const { conversations, isLoadingConversations, createNewConversation, fetchConversationById, selectConversation } = useConversations()

  // Keep a stable ref so the effect can read conversations without depending on them
  const conversationsRef = useRef(conversations)
  useEffect(() => {
    conversationsRef.current = conversations
  }, [conversations])

  // Handle userId or conversationId from URL - create or load conversation
  useEffect(() => {
    const loadConversationById = async (conversationId: string) => {
      try {
        const conversation = await fetchConversationById(conversationId)
        if (conversation) {
          setActiveChatId(conversation._id)
          selectConversation(conversation)
          setIsMobileListVisible(false)
        }
      } catch (error) {
        console.error('Failed to load conversation:', error)
      }
    }

    if (conversationId && user) {
      loadConversationById(conversationId)
      return
    }

    if (userId && user && !isLoadingConversations && !isCreatingConversationRef.current) {
      const existingConversation = conversationsRef.current.find((conv: Conversation) => {
        // Check if conversation has both the current user and the target user
        const hasCurrentUser = conv.participants.some((p: User) => p._id === user._id)
        const hasTargetUser = conv.participants.some((p: User) => p._id === userId)
        // Only 1-on-1 conversations (2 participants)
        const isOneOnOne = conv.participants.length === 2
        return hasCurrentUser && hasTargetUser && isOneOnOne
      })

      if (existingConversation) {
        setTimeout(() => {
          setActiveChatId(existingConversation._id)
          selectConversation(existingConversation)
          setIsMobileListVisible(false)
        }, 0)
      } else {
        // Create new conversation - don't set activeChatId until conversation is created
        isCreatingConversationRef.current = true
        createNewConversation([userId])
          .then((newConversation: Conversation) => {
            setActiveChatId(newConversation._id)
            selectConversation(newConversation)
            setIsMobileListVisible(false)
          })
          .catch((error: Error) => {
            console.error('Failed to create conversation:', error)
          })
          .finally(() => {
            isCreatingConversationRef.current = false
          })
      }
    } else if (!userId && !conversationId) {
      // If no id in URL, reset activeChatId
      setTimeout(() => setActiveChatId(null), 0)
      isCreatingConversationRef.current = false
    }
  }, [userId, conversationId, user, isLoadingConversations, createNewConversation, fetchConversationById, selectConversation])

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId)
    setIsMobileListVisible(false)
  }

  return (
    <div className="flex w-full h-screen sm:h-[calc(100vh)] overflow-hidden pb-16 sm:pb-0 bg-bg-dark">
      <ChatSidebar
        isMobileListVisible={isMobileListVisible}
        isChatListCollapsed={isChatListCollapsed}
        setIsChatListCollapsed={setIsChatListCollapsed}
        activeChatId={activeChatId}
        handleSelectChat={handleSelectChat}
      />

      <ChatWindow isMobileListVisible={isMobileListVisible} setIsMobileListVisible={setIsMobileListVisible} />
    </div>
  )
}

export default Messages
