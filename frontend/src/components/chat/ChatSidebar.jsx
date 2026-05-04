import React, { useEffect, useState } from 'react'

import { Edit, PanelLeftClose, PanelLeftOpen, Search } from 'lucide-react'

import ChatItem from './ChatItem'
import ChatListSkeleton from './ChatListSkeleton'
import { useConversations } from '../../context/ConversationContext'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import defaultAvatar from '../../assets/default-avatar.svg'

const ChatSidebar = ({
  isMobileListVisible,
  isChatListCollapsed,
  setIsChatListCollapsed,
  activeChatId,
  handleSelectChat,
}) => {
  const { user } = useAuth()
  const { conversations, isLoadingConversations, error, selectConversation } = useConversations()
  const { onlineUsers, getOnlineUsers } = useSocket()
  const [showOnlineOnly, setShowOnlineOnly] = useState(false)
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    getOnlineUsers()
  }, [getOnlineUsers])

  const handleChatClick = conversation => {
    const conversationId = conversation.id || conversation._id
    handleSelectChat(conversationId)
    selectConversation(conversation)
  }

  const isPlaceholderAvatar = url => {
    if (!url) return true
    return /dicebear|pravatar|api\.adorable|ui-avatars|gravatar|avatars?\./i.test(url)
  }

  const transformConversation = conversation => {
    if (!user || !conversation || !Array.isArray(conversation.participants)) return null

    const currentUserId = String(user._id || user.id || '')

    // Filter out the current user from participants
    const otherParticipants = conversation.participants.filter(
      p => String(p.id || p._id || '') !== currentUserId,
    )

    // If no other participants (self-conversation or invalid), skip showing it in the list
    if (otherParticipants.length === 0) return null

    const otherUser = otherParticipants[0]

    const avatarUrl =
      otherUser.avatar && !isPlaceholderAvatar(otherUser.avatar) ? otherUser.avatar : defaultAvatar

    return {
      id: conversation.id || conversation._id,
      user: {
        name: otherUser.name,
        avatar: avatarUrl,
        online: otherUser.isOnline || onlineUsers.has(otherUser.id || otherUser._id),
      },
      lastMessage: conversation.lastMessage?.content || 'No messages yet',
      time: conversation.lastMessage?.createdAt || conversation.updatedAt,
      unread: conversation.unreadCount?.[currentUserId] || 0,
    }
  }

  const transformedChats = conversations
    .map(transformConversation)
    .filter(Boolean)
    .filter((chat, index, self) => index === self.findIndex(c => c.id === chat.id))

  // Apply filters for online-only and unread-only toggles
  let visibleChats = transformedChats
  if (showOnlineOnly) visibleChats = visibleChats.filter(chat => chat.user.online)
  if (showUnreadOnly) visibleChats = visibleChats.filter(chat => Number(chat.unread) > 0)
  const normalizedQuery = searchQuery.trim().toLowerCase()
  const searchedChats = normalizedQuery
    ? visibleChats.filter(chat => {
        const name = chat.user.name?.toLowerCase() || ''
        const message = chat.lastMessage?.toLowerCase() || ''
        return name.includes(normalizedQuery) || message.includes(normalizedQuery)
      })
    : visibleChats

  return (
    <div
      className={`flex-shrink-0 flex flex-col border-r border-white/10 bg-bg-dark/95 backdrop-blur-xl z-20 transition-all duration-300 ${
        !isMobileListVisible ? '-translate-x-full sm:translate-x-0 hidden sm:flex' : 'flex w-full'
      } ${isChatListCollapsed ? 'sm:w-[80px]' : 'sm:w-[320px] lg:w-[380px]'}`}
    >
      {/* Sidebar Header */}
      <div
        className={`px-4 py-3 sticky top-0 bg-bg-dark/90 backdrop-blur-xl z-10 border-b border-white/10 flex flex-col ${isChatListCollapsed ? 'items-center' : ''}`}
      >
        <div
          className={`flex items-center w-full mb-4 mt-2 ${isChatListCollapsed ? 'justify-center' : 'justify-between'}`}
        >
          {!isChatListCollapsed && (
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-extrabold text-white">Messages</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowOnlineOnly(prev => !prev)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${showOnlineOnly ? 'bg-green-500/15 text-green-300 border border-green-500/20' : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'}`}
                >
                  {showOnlineOnly ? 'Online' : 'All'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowUnreadOnly(prev => !prev)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${showUnreadOnly ? 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/20' : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'}`}
                >
                  {showUnreadOnly ? 'Unread' : 'All'}
                </button>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            {!isChatListCollapsed && (
              <button className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                <Edit className="w-5 h-5 text-gray-300" />
              </button>
            )}
            <button
              onClick={() => setIsChatListCollapsed(!isChatListCollapsed)}
              className="hidden sm:flex w-8 h-8 rounded-full hover:bg-white/10 items-center justify-center transition-colors text-gray-400 hover:text-white"
              title={isChatListCollapsed ? 'Expand Chat List' : 'Collapse Chat List'}
            >
              {isChatListCollapsed ? (
                <PanelLeftOpen className="w-5 h-5" />
              ) : (
                <PanelLeftClose className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Search */}
        {!isChatListCollapsed ? (
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 top-0 flex items-center pointer-events-none text-text-dim group-focus-within:text-primary transition-colors">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search users in conversations"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
            />
          </div>
        ) : (
          <button
            className="p-2 mt-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-20 sm:pb-0">
        {isLoadingConversations ? (
          <div className="flex flex-col">
            <ChatListSkeleton />
            <ChatListSkeleton />
            <ChatListSkeleton />
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Failed to load conversations</h3>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        ) : searchedChats.length > 0 ? (
          searchedChats.map(chat => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isActive={activeChatId === chat.id}
              onClick={() => handleChatClick(conversations.find(c => (c.id || c._id) === chat.id))}
              isCollapsed={isChatListCollapsed}
            />
          ))
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              {searchQuery ? 'No matching conversations' : 'No conversations yet'}
            </h3>
            <p className="text-gray-500 text-sm">
              {searchQuery
                ? 'Try a different search term or clear the search.'
                : 'Start a conversation to see it here'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatSidebar
