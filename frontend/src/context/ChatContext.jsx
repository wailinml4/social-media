import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  createConversation,
  getConversations,
  getConversation,
  markConversationAsRead,
  createMessage,
  getMessages,
  markMessageAsRead,
} from '../services/chatService';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const {
    isConnected,
    joinChat,
    leaveChat,
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
    onConversationUpdated,
    offConversationUpdated,
    onMessageReadReceipt,
    offMessageReadReceipt,
    onMessageUpdated,
    offMessageUpdated,
    onMessageDeleted,
    offMessageDeleted,
  } = useSocket();

  const fetchConversations = useCallback(async () => {
    try {
      setIsLoadingConversations(true);
      setError(null);
      const result = await getConversations();
      setConversations(result.conversations || []);
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoadingConversations(false);
    }
  }, []);

  const fetchMessages = useCallback(async (conversationId) => {
    try {
      setIsLoadingMessages(true);
      setError(null);
      const result = await getMessages(conversationId);
      setMessages(result.messages || []);
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  const createNewConversation = useCallback(async (participants) => {
    try {
      setIsCreatingConversation(true);
      setError(null);
      const conversation = await createConversation(participants);
      setConversations((prev) => [conversation, ...prev]);
      return conversation;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsCreatingConversation(false);
    }
  }, []);

  const sendMessage = useCallback(
    async (conversationId, content, attachments = []) => {
      if (!user) return;
      try {
        setIsSendingMessage(true);
        setError(null);

        // Send via socket for real-time delivery
        if (isConnected) {
          socketSendMessage(conversationId, content, attachments);
        } else {
          // Fallback to REST API
          const result = await createMessage(conversationId, content, attachments);
          setMessages((prev) => [...prev, result.message]);
        }
      } catch (error) {
        setError(error.message);
        throw error;
      } finally {
        setIsSendingMessage(false);
      }
    },
    [isConnected, socketSendMessage]
  );

  const markAsRead = useCallback(
    async (conversationId) => {
      if (!user) return;
      try {
        setError(null);
        await markConversationAsRead(conversationId);
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === conversationId || conv._id === conversationId
              ? { ...conv, unreadCount: { ...conv.unreadCount, [user._id]: 0 } }
              : conv
          )
        );
      } catch (error) {
        setError(error.message);
        throw error;
      }
    },
    [user]
  );

  const editMessage = useCallback(
    async (messageId, content) => {
      try {
        setError(null);
        // Use socket for real-time update
        if (isConnected) {
          emitUpdateMessage(messageId, content);
          // Optimistically update local state
          setMessages((prev) =>
            prev.map((msg) =>
              (msg.id === messageId || msg._id === messageId) ? { ...msg, content } : msg
            )
          );
        } else {
          // Fallback to REST API
          const result = await updateMessage(messageId, content);
          setMessages((prev) =>
            prev.map((msg) =>
              (msg.id === messageId || msg._id === messageId) ? result : msg
            )
          );
        }
      } catch (error) {
        setError(error.message);
        throw error;
      }
    },
    [isConnected, emitUpdateMessage]
  );

  const removeMessage = useCallback(
    async (messageId) => {
      try {
        setError(null);
        // Use socket for real-time delete
        if (isConnected) {
          emitDeleteMessage(messageId);
          // Optimistically update local state
          setMessages((prev) => prev.filter((msg) => msg.id !== messageId && msg._id !== messageId));
        } else {
          // Fallback to REST API
          await deleteMessage(messageId);
          setMessages((prev) => prev.filter((msg) => msg.id !== messageId && msg._id !== messageId));
        }
      } catch (error) {
        setError(error.message);
        throw error;
      }
    },
    [isConnected, emitDeleteMessage]
  );

  const selectConversation = useCallback(
    async (conversation) => {
      setCurrentConversation(conversation);
      await fetchMessages(conversation.id || conversation._id);
      if (isConnected) {
        joinChat(conversation.id || conversation._id);
      }
    },
    [fetchMessages, isConnected, joinChat]
  );

  // Listen for real-time messages
  useEffect(() => {
    if (isConnected) {
      onMessage((data) => {
        const { message, conversation } = data;
        
        // Add message to current conversation if it matches
        if (currentConversation && (message.conversation === currentConversation.id || message.conversation === currentConversation._id)) {
          setMessages((prev) => [...prev, message]);
        }

        // Update conversation in list
        setConversations((prev) => {
          const updated = prev.map((conv) =>
            conv.id === conversation.id || conv._id === conversation._id
              ? { ...conv, lastMessage: conversation.lastMessage, unreadCount: conversation.unreadCount, updatedAt: conversation.updatedAt }
              : conv
          );
          // Move updated conversation to top
          const updatedConv = updated.find(
            (c) => c.id === conversation.id || c._id === conversation._id
          );
          if (updatedConv) {
            return [updatedConv, ...updated.filter((c) => c.id !== conversation.id && c._id !== conversation._id)];
          }
          return updated;
        });
      });

      return () => {
        offMessage();
      };
    }
  }, [isConnected, onMessage, offMessage, currentConversation]);

  // Listen for conversation updates
  useEffect(() => {
    if (isConnected) {
      onConversationUpdated((conversation) => {
        setConversations((prev) => {
          const updated = prev.map((conv) =>
            conv.id === conversation.id || conv._id === conversation._id
              ? { ...conv, lastMessage: conversation.lastMessage, unreadCount: conversation.unreadCount, updatedAt: conversation.updatedAt }
              : conv
          );
          const updatedConv = updated.find(
            (c) => c.id === conversation.id || c._id === conversation._id
          );
          if (updatedConv) {
            return [updatedConv, ...updated.filter((c) => c.id !== conversation.id && c._id !== conversation._id)];
          }
          return updated;
        });
      });

      return () => {
        offConversationUpdated();
      };
    }
  }, [isConnected, onConversationUpdated, offConversationUpdated]);

  // Listen for typing indicators
  useEffect(() => {
    if (isConnected) {
      onTyping(({ userId, conversationId }) => {
        setTypingUsers((prev) => ({
          ...prev,
          [conversationId]: [...new Set([...(prev[conversationId] || []), userId])],
        }));
      });

      onStoppedTyping(({ userId, conversationId }) => {
        setTypingUsers((prev) => ({
          ...prev,
          [conversationId]: (prev[conversationId] || []).filter((id) => id !== userId),
        }));
      });

      return () => {
        offTyping();
        offStoppedTyping();
      };
    }
  }, [isConnected, onTyping, offTyping, onStoppedTyping, offStoppedTyping]);

  // Listen for message updates
  useEffect(() => {
    if (isConnected) {
      onMessageUpdated((message) => {
        setMessages((prev) =>
          prev.map((msg) =>
            (msg.id === message.id || msg._id === message._id) ? message : msg
          )
        );
      });

      onMessageDeleted(({ messageId }) => {
        setMessages((prev) => prev.filter((msg) => msg.id !== messageId && msg._id !== messageId));
      });

      onMessageReadReceipt(({ messageId, userId }) => {
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === messageId || msg._id === messageId) {
              const readBy = msg.readBy || [];
              if (!readBy.includes(userId)) {
                return { ...msg, readBy: [...readBy, userId] };
              }
            }
            return msg;
          })
        );
      });

      return () => {
        offMessageUpdated();
        offMessageDeleted();
        offMessageReadReceipt();
      };
    }
  }, [isConnected, onMessageUpdated, offMessageUpdated, onMessageDeleted, offMessageDeleted, onMessageReadReceipt, offMessageReadReceipt]);

  // Leave chat room when switching conversations
  useEffect(() => {
    return () => {
      if (currentConversation && isConnected) {
        leaveChat(currentConversation.id || currentConversation._id);
      }
    };
  }, [currentConversation, isConnected, leaveChat]);

  // Fetch conversations on mount
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user, fetchConversations]);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversation,
        messages,
        isLoadingConversations,
        isLoadingMessages,
        isCreatingConversation,
        isSendingMessage,
        typingUsers,
        error,
        fetchConversations,
        fetchMessages,
        createNewConversation,
        sendMessage,
        markAsRead,
        editMessage,
        removeMessage,
        selectConversation,
        setCurrentConversation,
        emitTyping,
        emitStopTyping,
        emitMessageRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
