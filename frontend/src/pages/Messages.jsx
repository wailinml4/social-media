import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import ChatListSkeleton from '../components/chat/ChatListSkeleton';
import ChatMessageSkeleton from '../components/chat/ChatMessageSkeleton';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatWindow from '../components/chat/ChatWindow';

import { getAllChats, getChatMessages, getCurrentUser, sendMessage } from '../services/messagesService';
import { useMessageBubbleAnimation } from '../animations/useLikeAnimation';

const Messages = () => {
  const [activeChatId, setActiveChatId] = useState(null);
  const [inputText, setInputText] = useState('');
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [chatsLoading, setChatsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [chatsError, setChatsError] = useState(null);
  const [messagesError, setMessagesError] = useState(null);
  const [isMobileListVisible, setIsMobileListVisible] = useState(true);
  const [isChatListCollapsed, setIsChatListCollapsed] = useState(false);
  const messagesEndRef = useRef(null);

  const animateNewMessage = useMessageBubbleAnimation();

  const activeChat = chats.find(chat => chat.id === activeChatId);
  const currentMessages = activeChatId ? (messages[activeChatId] || []) : [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setChatsLoading(true);
        setChatsError(null);
        const [chatsData, userData] = await Promise.all([getAllChats(), getCurrentUser()]);
        setChats(chatsData);
        setCurrentUser(userData);
      } catch (error) {
        setChatsError(error.message || 'Failed to load chats');
        toast.error('Failed to load conversations. Please try again.');
      } finally {
        setChatsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (activeChatId) {
      const fetchMessages = async () => {
        try {
          setMessagesLoading(true);
          setMessagesError(null);
          const messagesData = await getChatMessages(activeChatId);
          setMessages(prev => ({ ...prev, [activeChatId]: messagesData }));
        } catch (error) {
          setMessagesError(error.message || 'Failed to load messages');
          toast.error('Failed to load messages. Please try again.');
        } finally {
          setMessagesLoading(false);
        }
      };
      fetchMessages();
    }
  }, [activeChatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeChatId) {
      scrollToBottom();
    }
  }, [activeChatId, messages]);

  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
    setIsMobileListVisible(false);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeChatId) return;

    const newMessage = {
      id: Date.now(),
      text: inputText,
      senderId: currentUser.id,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMessage]
    }));
    setInputText('');

    // GSAP animation for new message bubble
    setTimeout(() => {
      const messageBubbles = document.querySelectorAll('.message-bubble');
      const lastBubble = messageBubbles[messageBubbles.length - 1];
      if (lastBubble) {
        animateNewMessage(lastBubble);
      }
    }, 10);

    await sendMessage(activeChatId, newMessage);
  };

  return (
    <div className="flex w-full h-screen sm:h-[calc(100vh)] overflow-hidden pb-16 sm:pb-0 bg-bg-dark">
      <ChatSidebar
        isMobileListVisible={isMobileListVisible}
        isChatListCollapsed={isChatListCollapsed}
        setIsChatListCollapsed={setIsChatListCollapsed}
        mockChats={chats}
        activeChatId={activeChatId}
        handleSelectChat={handleSelectChat}
        loading={chatsLoading}
        error={chatsError}
      />

      <ChatWindow
        activeChat={activeChat}
        isMobileListVisible={isMobileListVisible}
        setIsMobileListVisible={setIsMobileListVisible}
        currentMessages={currentMessages}
        currentUser={currentUser}
        inputText={inputText}
        setInputText={setInputText}
        handleSendMessage={handleSendMessage}
        messagesEndRef={messagesEndRef}
        loading={messagesLoading}
        error={messagesError}
      />
    </div>
  );
};

export default Messages;
