import { USE_MOCK_API, simulateDelay, simulateError } from '../config/api';

import { profileData } from '../data/profile';

/**
 * Get current user profile
 * @returns {Promise<Object>} User profile data
 */
export const getCurrentProfile = async () => {
  if (USE_MOCK_API) {
    await simulateDelay();
    simulateError();
    return profileData;
  }
  // Real API call would go here
};

/**
 * Get user profile by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User profile data
 */
export const getProfileById = async (userId) => {
  if (USE_MOCK_API) {
    await simulateDelay();
    simulateError();
    return profileData;
  }
  // Real API call would go here
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} data - Updated profile data
 * @returns {Promise<Object>} Updated profile
 */
export const updateProfile = async (userId, data) => {
  if (USE_MOCK_API) {
    await simulateDelay();
    simulateError();
    profileData.user = { ...profileData.user, ...data };
    return profileData;
  }
  // Real API call would go here
};

/**
 * Get user posts with pagination
 * @param {Object} options - Pagination options
 * @param {number} options.offset - Number of posts to skip
 * @param {number} options.limit - Number of posts to return
 * @returns {Promise<Array>} Array of posts
 */
export const getUserPosts = async ({ offset = 0, limit = 10 } = {}) => {
  if (USE_MOCK_API) {
    await simulateDelay();
    simulateError();
    return profileData.posts.slice(offset, offset + limit);
  }
  // Real API call would go here
};

/**
 * Get user bookmarks with pagination
 * @param {Object} options - Pagination options
 * @param {number} options.offset - Number of bookmarks to skip
 * @param {number} options.limit - Number of bookmarks to return
 * @returns {Promise<Array>} Array of bookmarks
 */
export const getUserBookmarks = async ({ offset = 0, limit = 10 } = {}) => {
  if (USE_MOCK_API) {
    await simulateDelay();
    simulateError();
    return profileData.bookmarks.slice(offset, offset + limit);
  }
  // Real API call would go here
};
