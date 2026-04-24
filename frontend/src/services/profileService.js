import axiosInstance from '../config/api';

import { profileData } from '../data/profile';

/**
 * Get current user profile
 * @returns {Promise<Object>} User profile data
 */
export const getCurrentProfile = async () => {
  const response = await axiosInstance.get('/users/me/profile');
  return response.data.data;
};

/**
 * Get user profile by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User profile data
 */
export const getProfileById = async (userId) => {
  const response = await axiosInstance.get(`/users/${userId}/profile`);
  return response.data.data;
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} data - Updated profile data
 * @returns {Promise<Object>} Updated profile
 */
export const updateProfile = async (userId, data) => {
  const response = await axiosInstance.put(`/users/${userId}/profile`, data);
  return response.data.data;
};

/**
 * Get user posts with pagination
 * @param {Object} options - Pagination options
 * @param {number} options.offset - Number of posts to skip
 * @param {number} options.limit - Number of posts to return
 * @returns {Promise<Array>} Array of posts
 */
export const getUserPosts = async ({ offset = 0, limit = 10 } = {}) => {
  const response = await axiosInstance.get(`/users/posts?offset=${offset}&limit=${limit}`);
  return response.data.data;
};

/**
 * Get user bookmarks with pagination
 * @param {Object} options - Pagination options
 * @param {number} options.offset - Number of bookmarks to skip
 * @param {number} options.limit - Number of bookmarks to return
 * @returns {Promise<Array>} Array of bookmarks
 */
export const getUserBookmarks = async ({ offset = 0, limit = 10 } = {}) => {
  const response = await axiosInstance.get(`/users/bookmarks?offset=${offset}&limit=${limit}`);
  return response.data.data;
};
