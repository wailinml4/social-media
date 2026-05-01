import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const { user, token } = useAuth();

  useEffect(() => {
    if (user) {
      const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const newSocket = io(socketUrl, {
        withCredentials: true,
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
        newSocket.emit('get_online_users');
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
      });

      newSocket.on('user_online', ({ userId }) => {
        setOnlineUsers((prev) => new Set([...prev, userId]));
      });

      newSocket.on('user_offline', ({ userId }) => {
        setOnlineUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      });

      newSocket.on('online_users', (users) => {
        setOnlineUsers(new Set(users.map((u) => u._id.toString())));
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
        setSocket(null);
        setIsConnected(false);
      };
    }
  }, [user, token]);

  const joinChat = useCallback((conversationId) => {
    if (socket && isConnected) {
      socket.emit('join_chat', { conversationId });
    }
  }, [socket, isConnected]);

  const leaveChat = useCallback((conversationId) => {
    if (socket && isConnected) {
      socket.emit('leave_chat', { conversationId });
    }
  }, [socket, isConnected]);

  const sendMessage = useCallback((conversationId, content, attachments = []) => {
    if (socket && isConnected) {
      socket.emit('send_message', { conversationId, content, attachments });
    }
  }, [socket, isConnected]);

  const emitTyping = (conversationId) => {
    if (socket && isConnected) {
      socket.emit('typing_start', { conversationId });
    }
  };

  const emitStopTyping = (conversationId) => {
    if (socket && isConnected) {
      socket.emit('typing_stop', { conversationId });
    }
  };

  const emitMessageRead = (messageId) => {
    if (socket && isConnected) {
      socket.emit('message_read', { messageId });
    }
  };

  const emitUpdateMessage = useCallback((messageId, content) => {
    if (socket && isConnected) {
      socket.emit('update_message', { messageId, content });
    }
  }, [socket, isConnected]);

  const emitDeleteMessage = useCallback((messageId) => {
    if (socket && isConnected) {
      socket.emit('delete_message', { messageId });
    }
  }, [socket, isConnected]);

  const emitNotificationRead = useCallback((notificationId) => {
    if (socket && isConnected) {
      socket.emit('notification_read', { notificationId });
    }
  }, [socket, isConnected]);

  const getOnlineUsers = useCallback(() => {
    if (socket && isConnected) {
      socket.emit('get_online_users');
    }
  }, [socket, isConnected]);

  const onMessage = (callback) => {
    if (socket) {
      socket.on('message_received', callback);
    }
  };

  const offMessage = () => {
    if (socket) {
      socket.off('message_received');
    }
  };

  const onTyping = (callback) => {
    if (socket) {
      socket.on('user_typing', callback);
    }
  };

  const offTyping = () => {
    if (socket) {
      socket.off('user_typing');
    }
  };

  const onStoppedTyping = (callback) => {
    if (socket) {
      socket.on('user_stopped_typing', callback);
    }
  };

  const offStoppedTyping = () => {
    if (socket) {
      socket.off('user_stopped_typing');
    }
  };

  const onMessageUpdated = (callback) => {
    if (socket) {
      socket.on('message_updated', callback);
    }
  };

  const offMessageUpdated = () => {
    if (socket) {
      socket.off('message_updated');
    }
  };

  const onMessageDeleted = (callback) => {
    if (socket) {
      socket.on('message_deleted', callback);
    }
  };

  const offMessageDeleted = () => {
    if (socket) {
      socket.off('message_deleted');
    }
  };

  const onMessageReadReceipt = (callback) => {
    if (socket) {
      socket.on('message_read_receipt', callback);
    }
  };

  const offMessageReadReceipt = () => {
    if (socket) {
      socket.off('message_read_receipt');
    }
  };

  const onNotification = (callback) => {
    if (socket) {
      socket.on('notification', callback);
    }
  };

  const offNotification = () => {
    if (socket) {
      socket.off('notification');
    }
  };

  const onConversationUpdated = (callback) => {
    if (socket) {
      socket.on('conversation_updated', callback);
    }
  };

  const offConversationUpdated = () => {
    if (socket) {
      socket.off('conversation_updated');
    }
  };

  const value = useMemo(() => ({
    socket,
    isConnected,
    onlineUsers,
    joinChat,
    leaveChat,
    sendMessage,
    emitTyping,
    emitStopTyping,
    emitMessageRead,
    emitUpdateMessage,
    emitDeleteMessage,
    emitNotificationRead,
    getOnlineUsers,
    onMessage,
    offMessage,
    onTyping,
    offTyping,
    onStoppedTyping,
    offStoppedTyping,
    onNotification,
    offNotification,
    onConversationUpdated,
    offConversationUpdated,
    onMessageReadReceipt,
    offMessageReadReceipt,
    onMessageUpdated,
    offMessageUpdated,
    onMessageDeleted,
    offMessageDeleted,
  }), [
    socket,
    isConnected,
    onlineUsers,
    joinChat,
    leaveChat,
    sendMessage,
    emitTyping,
    emitStopTyping,
    emitMessageRead,
    emitUpdateMessage,
    emitDeleteMessage,
    emitNotificationRead,
    getOnlineUsers,
    onMessage,
    offMessage,
    onTyping,
    offTyping,
    onStoppedTyping,
    offStoppedTyping,
    onNotification,
    offNotification,
    onConversationUpdated,
    offConversationUpdated,
    onMessageReadReceipt,
    offMessageReadReceipt,
    onMessageUpdated,
    offMessageUpdated,
    onMessageDeleted,
    offMessageDeleted,
  ]);

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
