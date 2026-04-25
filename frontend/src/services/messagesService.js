import axiosInstance from '../config/api';

import { currentUser, mockChats, mockMessages } from '../data/messages';

export const getAllChats = async () => {
  const response = await axiosInstance.get('/chats');
  return response.data.data;
};

export const getChatById = async (chatId) => {
  const response = await axiosInstance.get(`/chats/${chatId}`);
  return response.data.data;
};

export const getChatMessages = async (chatId) => {
  const response = await axiosInstance.get(`/chats/${chatId}/messages`);
  return response.data.data;
};

export const sendMessage = async (chatId, data) => {
  const response = await axiosInstance.post(`/chats/${chatId}/messages`, data);
  return response.data.data;
};

export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/users/me');
  return response.data.data;
};
