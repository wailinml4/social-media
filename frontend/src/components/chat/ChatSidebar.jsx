import React from 'react';

import { Edit, PanelLeftClose, PanelLeftOpen, Search } from 'lucide-react';

import ChatItem from './ChatItem';
import ChatListSkeleton from './ChatListSkeleton';

const ChatSidebar = ({
  isMobileListVisible,
  isChatListCollapsed,
  setIsChatListCollapsed,
  mockChats,
  activeChatId,
  handleSelectChat,
  loading,
  error
}) => {
  return (
    <div 
      className={`flex-shrink-0 flex flex-col border-r border-white/10 bg-bg-dark/95 backdrop-blur-xl z-20 transition-all duration-300 ${
        !isMobileListVisible ? '-translate-x-full sm:translate-x-0 hidden sm:flex' : 'flex w-full'
      } ${isChatListCollapsed ? 'sm:w-[80px]' : 'sm:w-[320px] lg:w-[380px]'}`}
    >
      {/* Sidebar Header */}
      <div className={`px-4 py-3 sticky top-0 bg-bg-dark/90 backdrop-blur-xl z-10 border-b border-white/10 flex flex-col ${isChatListCollapsed ? 'items-center' : ''}`}>
        <div className={`flex items-center w-full mb-4 mt-2 ${isChatListCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isChatListCollapsed && <h2 className="text-xl font-extrabold text-white">Messages</h2>}
          <div className="flex items-center gap-2">
            {!isChatListCollapsed && (
              <button className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                <Edit className="w-5 h-5 text-gray-300" />
              </button>
            )}
            <button 
              onClick={() => setIsChatListCollapsed(!isChatListCollapsed)}
              className="hidden sm:flex w-8 h-8 rounded-full hover:bg-white/10 items-center justify-center transition-colors text-gray-400 hover:text-white"
              title={isChatListCollapsed ? "Expand Chat List" : "Collapse Chat List"}
            >
              {isChatListCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
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
              placeholder="Search messages" 
              className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
            />
          </div>
        ) : (
          <button className="p-2 mt-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors" title="Search">
             <Search className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-20 sm:pb-0">
        {loading ? (
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
        ) : (
          mockChats.map(chat => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isActive={activeChatId === chat.id}
              onClick={() => handleSelectChat(chat.id)}
              isCollapsed={isChatListCollapsed}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
