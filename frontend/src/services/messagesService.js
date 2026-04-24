import axiosInstance from '../config/api';

import { currentUser, mockChats, mockMessages } from '../data/messages';

/**
 * Get all chats for current user
 * @returns {Promise<Array>} Array of chats
 */
export const getAllChats = async () => {
  const response = await axiosInstance.get('/chats');
  return response.data.data;
};

/**
 * Get a single chat by ID
 * @param {string} chatId - Chat ID
 * @returns {Promise<Object>} Chat object
 */
export const getChatById = async (chatId) => {
  const response = await axiosInstance.get(`/chats/${chatId}`);
  return response.data.data;
};

/**
 * Get messages for a specific chat
 * @param {string} chatId - Chat ID
 * @returns {Promise<Array>} Array of messages
 */
export const getChatMessages = async (chatId) => {
  const response = await axiosInstance.get(`/chats/${chatId}/messages`);
  return response.data.data;
};

/**
 * Send a new message
 * @param {string} chatId - Chat ID
 * @param {Object} data - Message data
 * @returns {Promise<Object>} Created message
 */
export const sendMessage = async (chatId, data) => {
  const response = await axiosInstance.post(`/chats/${chatId}/messages`, data);
  return response.data.data;
};

/**
 * Get current user
 * @returns {Promise<Object>} Current user data
 */
export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/users/me');
  return response.data.data;
};
