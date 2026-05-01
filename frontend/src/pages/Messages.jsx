import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import ChatSidebar from '../components/chat/ChatSidebar';
import ChatWindow from '../components/chat/ChatWindow';
import { useConversations } from '../context/ConversationContext';
import { useAuth } from '../context/AuthContext';

const Messages = () => {
  const { userId } = useParams();
  const [activeChatId, setActiveChatId] = useState(null);
  const [isMobileListVisible, setIsMobileListVisible] = useState(true);
  const [isChatListCollapsed, setIsChatListCollapsed] = useState(false);
  const isCreatingConversationRef = useRef(false);

  const { user } = useAuth();
  const { conversations, isLoadingConversations, createNewConversation, selectConversation } = useConversations();

  // Handle userId from URL - create or find conversation
  useEffect(() => {
    if (userId && user && !isLoadingConversations && !isCreatingConversationRef.current) {
      const existingConversation = conversations.find(conv => {
        // Check if conversation has both the current user and the target user
        const hasCurrentUser = conv.participants.some(
          (p) => p.id === user._id || p._id === user._id
        );
        const hasTargetUser = conv.participants.some(
          (p) => p.id === userId || p._id === userId
        );
        // Only 1-on-1 conversations (2 participants)
        const isOneOnOne = conv.participants.length === 2;
        return hasCurrentUser && hasTargetUser && isOneOnOne;
      });

      if (existingConversation) {
        const conversationId = existingConversation.id || existingConversation._id;
        setActiveChatId(conversationId);
        selectConversation(existingConversation);
        setIsMobileListVisible(false);
      } else {
        // Create new conversation - don't set activeChatId until conversation is created
        isCreatingConversationRef.current = true;
        createNewConversation([userId])
          .then((newConversation) => {
            const conversationId = newConversation.id || newConversation._id;
            setActiveChatId(conversationId);
            selectConversation(newConversation);
            setIsMobileListVisible(false);
          })
          .catch((error) => {
            console.error('Failed to create conversation:', error);
          })
          .finally(() => {
            isCreatingConversationRef.current = false;
          });
      }
    } else if (!userId) {
      // If no userId in URL, reset activeChatId
      setActiveChatId(null);
      isCreatingConversationRef.current = false;
    }
  }, [userId, user, isLoadingConversations, createNewConversation, selectConversation]);

  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
    setIsMobileListVisible(false);
  };

  return (
    <div className="flex w-full h-screen sm:h-[calc(100vh)] overflow-hidden pb-16 sm:pb-0 bg-bg-dark">
      <ChatSidebar
        isMobileListVisible={isMobileListVisible}
        isChatListCollapsed={isChatListCollapsed}
        setIsChatListCollapsed={setIsChatListCollapsed}
        activeChatId={activeChatId}
        handleSelectChat={handleSelectChat}
      />

      <ChatWindow
        isMobileListVisible={isMobileListVisible}
        setIsMobileListVisible={setIsMobileListVisible}
      />
    </div>
  );
};

export default Messages;
