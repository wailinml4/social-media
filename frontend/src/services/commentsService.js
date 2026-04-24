import axiosInstance from '../config/api';

import { mockComments } from '../data/comments';

/**
 * Get all comments for a specific post
 * @param {number} postId - Post ID
 * @returns {Promise<Array>} Array of comments
 */
export const getCommentsByPostId = async (postId) => {
  const response = await axiosInstance.get(`/comments/post/${postId}`);
  return response.data.data;
};

/**
 * Get a single comment by ID
 * @param {number} id - Comment ID
 * @returns {Promise<Object>} Comment object
 */
export const getCommentById = async (id) => {
  const response = await axiosInstance.get(`/comments/${id}`);
  return response.data.data;
};

/**
 * Create a new comment
 * @param {Object} data - Comment data
 * @returns {Promise<Object>} Created comment
 */
export const createComment = async (data) => {
  const response = await axiosInstance.post('/comments', data);
  return response.data.data;
};

/**
 * Update an existing comment
 * @param {number} id - Comment ID
 * @param {Object} data - Updated comment data
 * @returns {Promise<Object>} Updated comment
 */
export const updateComment = async (id, data) => {
  const response = await axiosInstance.put(`/comments/${id}`, data);
  return response.data.data;
};

/**
 * Delete a comment
 * @param {number} id - Comment ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteComment = async (id) => {
  const response = await axiosInstance.delete(`/comments/${id}`);
  return response.data.data;
};
