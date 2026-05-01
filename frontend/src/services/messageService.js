import axiosInstance from '../config/api';

export const createMessage = async (conversationId, content, attachments = []) => {
  const response = await axiosInstance.post('/messages', { conversationId, content, attachments });
  return response.data.data;
};

export const getMessages = async (conversationId, page = 1, limit = 50) => {
  const response = await axiosInstance.get(`/messages/conversation/${conversationId}`, {
    params: { page, limit },
  });
  return response.data.data;
};

export const markMessageAsRead = async (messageId) => {
  const response = await axiosInstance.put(`/messages/${messageId}/read`);
  return response.data.data;
};
