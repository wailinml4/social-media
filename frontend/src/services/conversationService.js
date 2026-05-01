import axiosInstance from '../config/api';

export const createConversation = async (participants) => {
  const response = await axiosInstance.post('/conversations', { participants });
  return response.data.data;
};

export const getConversations = async (page = 1, limit = 20) => {
  const response = await axiosInstance.get('/conversations', {
    params: { page, limit },
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
