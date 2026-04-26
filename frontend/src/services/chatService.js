import axiosInstance from '../config/api';

export const createConversation = async (participants) => {
  const response = await axiosInstance.post('/conversations', { participants });
  return response.data.data;
};

export const getConversations = async (offset = 0, limit = 20) => {
  const response = await axiosInstance.get('/conversations', {
    params: { offset, limit },
  });
  return response.data.data;
};

export const getConversation = async (conversationId) => {
  const response = await axiosInstance.get(`/conversations/${conversationId}`);
  return response.data.data;
};

export const markConversationAsRead = async (conversationId) => {
  const response = await axiosInstance.put(`/conversations/${conversationId}/read`);
  return response.data.data;
};

export const createMessage = async (conversationId, content, attachments = []) => {
  const response = await axiosInstance.post('/messages', { conversationId, content, attachments });
  return response.data.data;
};

export const getMessages = async (conversationId, offset = 0, limit = 50) => {
  const response = await axiosInstance.get(`/messages/conversation/${conversationId}`, {
    params: { offset, limit },
  });
  return response.data.data;
};

export const markMessageAsRead = async (messageId) => {
  const response = await axiosInstance.put(`/messages/${messageId}/read`);
  return response.data.data;
};
