import { USE_MOCK_API, simulateDelay, simulateError } from '../config/api';

import { mockComments } from '../data/comments';

/**
 * Get all comments for a specific post
 * @param {number} postId - Post ID
 * @returns {Promise<Array>} Array of comments
 */
export const getCommentsByPostId = async (postId) => {
  if (USE_MOCK_API) {
    await simulateDelay();
    simulateError();
    return mockComments.filter(comment => comment.postId === postId);
  }
  // Real API call would go here
};

/**
 * Get a single comment by ID
 * @param {number} id - Comment ID
 * @returns {Promise<Object>} Comment object
 */
export const getCommentById = async (id) => {
  if (USE_MOCK_API) {
    await simulateDelay();
    simulateError();
    return mockComments.find(comment => comment.id === id);
  }
  // Real API call would go here
};

/**
 * Create a new comment
 * @param {Object} data - Comment data
 * @returns {Promise<Object>} Created comment
 */
export const createComment = async (data) => {
  if (USE_MOCK_API) {
    await simulateDelay();
    simulateError();
    const newComment = { id: Date.now(), ...data };
    mockComments.push(newComment);
    return newComment;
  }
  // Real API call would go here
};

/**
 * Update an existing comment
 * @param {number} id - Comment ID
 * @param {Object} data - Updated comment data
 * @returns {Promise<Object>} Updated comment
 */
export const updateComment = async (id, data) => {
  if (USE_MOCK_API) {
    await simulateDelay();
    simulateError();
    const index = mockComments.findIndex(comment => comment.id === id);
    if (index !== -1) {
      mockComments[index] = { ...mockComments[index], ...data };
      return mockComments[index];
    }
    return null;
  }
  // Real API call would go here
};

/**
 * Delete a comment
 * @param {number} id - Comment ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteComment = async (id) => {
  if (USE_MOCK_API) {
    await simulateDelay();
    simulateError();
    const index = mockComments.findIndex(comment => comment.id === id);
    if (index !== -1) {
      mockComments.splice(index, 1);
      return true;
    }
    return false;
  }
  // Real API call would go here
};
