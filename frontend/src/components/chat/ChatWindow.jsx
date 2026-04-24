import React from 'react';

import { ChevronLeft, MoreVertical, Paperclip, Phone, Send, Smile, Video } from 'lucide-react';

import Button from '../ui/Button';
import ChatMessageSkeleton from './ChatMessageSkeleton';
import MessageBubble from './MessageBubble';

const ChatWindow = ({
  activeChat,
  isMobileListVisible,
  setIsMobileListVisible,
  currentMessages,
  currentUser,
  inputText,
  setInputText,
  handleSendMessage,
  messagesEndRef,
  loading,
  error
}) => {
  return (
    <div className={`flex-1 flex flex-col bg-bg-dark min-w-0 ${
      isMobileListVisible ? 'hidden sm:flex' : 'flex'
    }`}>
      
      {activeChat ? (
        <>
          {/* Chat Header */}
          <div className="h-[72px] px-4 sm:px-6 flex items-center justify-between border-b border-white/10 bg-bg-dark/80 backdrop-blur-xl sticky top-0 z-10 flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <button 
                onClick={() => setIsMobileListVisible(true)}
                className="sm:hidden -ml-2 p-2 text-gray-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <img src={activeChat.user.avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-white/10" />
              <div className="min-w-0">
                <h3 className="font-bold text-white text-[15px] truncate">{activeChat.user.name}</h3>
                <p className="text-xs text-text-dim truncate">
                  {activeChat.user.online ? <span className="text-green-500">Online</span> : 'Last seen recently'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2 text-text-dim">
              <button className="p-2 hover:bg-white/10 hover:text-primary rounded-full transition-colors hidden sm:block">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-white/10 hover:text-primary rounded-full transition-colors">
                <Video className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-white/10 hover:text-primary rounded-full transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div
            className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 no-scrollbar"
            style={{ backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.02) 0%, transparent 100%)' }}
          >
            {loading ? (
              <div className="flex flex-col">
                <ChatMessageSkeleton isMe={false} />
                <ChatMessageSkeleton isMe={true} />
                <ChatMessageSkeleton isMe={false} />
              </div>
            ) : error ? (
              <div className="h-full flex flex-col items-center justify-center text-text-dim">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">⚠️</span>
                </div>
                <p className="text-sm">{error}</p>
              </div>
            ) : currentMessages.length > 0 ? (
              currentMessages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} isMe={msg.senderId === currentUser.id} />
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-text-dim">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <Smile className="w-8 h-8 text-text-dim" />
                </div>
                <p>Say hello to {activeChat.user.name}</p>
              </div>
            )}
            <div ref={messagesEndRef} className="h-4" />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-bg-dark border-t border-white/10 flex-shrink-0">
            <form 
              onSubmit={handleSendMessage}
              className="flex items-end gap-2 bg-white/5 border border-white/10 rounded-2xl p-2 focus-within:border-primary/50 transition-colors"
            >
              <button type="button" className="p-2 text-text-dim hover:text-primary transition-colors flex-shrink-0">
                <Paperclip className="w-5 h-5" />
              </button>
              
              <textarea 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                placeholder="Start a new message" 
                className="flex-1 bg-transparent border-none text-white focus:ring-0 resize-none max-h-32 min-h-[40px] py-2 px-2 text-[15px] placeholder-gray-500 outline-none"
                rows={1}
              />
              
              <button type="button" className="p-2 text-text-dim hover:text-primary transition-colors flex-shrink-0">
                <Smile className="w-5 h-5" />
              </button>
              
              <Button 
                type="submit" 
                size="sm"
                disabled={!inputText.trim()}
                className="ml-1"
              >
                <Send className="w-5 h-5 ml-0.5" />
              </Button>
            </form>
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="hidden sm:flex h-full flex-col items-center justify-center text-center px-4">
          <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mb-6">
            <Send className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Select a message</h2>
          <p className="text-text-dim max-w-md">
            Choose from your existing conversations, start a new one, or just keep swimming.
          </p>
          <Button className="mt-8 px-8">
            New message
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
