import axiosInstance from '../config/api';

import { storiesData } from '../data/stories';

/**
 * Get all stories
 * @returns {Promise<Array>} Array of stories
 */
export const getAllStories = async () => {
  const response = await axiosInstance.get('/stories');
  return response.data.data;
};

/**
 * Get a single story by ID
 * @param {string} storyId - Story ID
 * @returns {Promise<Object>} Story object
 */
export const getStoryById = async (storyId) => {
  const response = await axiosInstance.get(`/stories/${storyId}`);
  return response.data.data;
};

/**
 * Mark a story as seen
 * @param {string} storyId - Story ID
 * @returns {Promise<Object>} Updated story
 */
export const markStoryAsSeen = async (storyId) => {
  const response = await axiosInstance.post(`/stories/${storyId}/seen`);
  return response.data.data;
};

/**
 * Create a new story
 * @param {Object} data - Story data
 * @returns {Promise<Object>} Created story
 */
export const createStory = async (data) => {
  const response = await axiosInstance.post('/stories', data);
  return response.data.data;
};

/**
 * Delete a story
 * @param {string} storyId - Story ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteStory = async (storyId) => {
  const response = await axiosInstance.delete(`/stories/${storyId}`);
  return response.data.data;
};
