import { USE_MOCK_API, simulateDelay, simulateError } from '../config/api';

import { currentUser, mockChats, mockMessages } from '../data/messages';

/**
 * Get all chats for current user
 * @returns {Promise<Array>} Array of chats
 */
export const getAllChats = async () => {
  if (USE_MOCK_API) {
    await simulateDelay();
    simulateError();
    return mockChats;
  }
  // Real API call would go here
};

/**
 * Get a single chat by ID
 * @param {string} chatId - Chat ID
 * @returns {Promise<Object>} Chat object
 */
export const getChatById = async (chatId) => {
  if (USE_MOCK_API) {
    await simulateDelay();
    simulateError();
    return mockChats.find(chat => chat.id === chatId);
  }
  // Real API call would go here
};

/**
 * Get messages for a specific chat
 * @param {string} chatId - Chat ID
 * @returns {Promise<Array>} Array of messages
 */
export const getChatMessages = async (chatId) => {
  if (USE_MOCK_API) {
    await simulateDelay();
    simulateError();
    return mockMessages[chatId] || [];
  }
  // Real API call would go here
};

/**
 * Send a new message
 * @param {string} chatId - Chat ID
 * @param {Object} data - Message data
 * @returns {Promise<Object>} Created message
 */
export const sendMessage = async (chatId, data) => {
  if (USE_MOCK_API) {
    await simulateDelay();
    simulateError();
    const newMessage = { id: `m${Date.now()}`, senderId: currentUser.id, ...data };
    if (!mockMessages[chatId]) {
      mockMessages[chatId] = [];
    }
    mockMessages[chatId].push(newMessage);
    return newMessage;
  }
  // Real API call would go here
};

/**
 * Get current user
 * @returns {Promise<Object>} Current user data
 */
export const getCurrentUser = async () => {
  if (USE_MOCK_API) {
    await simulateDelay();
    simulateError();
    return currentUser;
  }
  // Real API call would go here
};
