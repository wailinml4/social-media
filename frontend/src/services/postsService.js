import axiosInstance from '../config/api';

import { mockPostsDB } from '../data/posts';

/**
 * Get all posts with optional pagination and filter
 * @param {Object} options - Pagination and filter options
 * @param {number} options.offset - Number of posts to skip
 * @param {number} options.limit - Number of posts to return
 * @param {string} options.filter - Feed filter: 'for_you', 'friends', 'following'
 * @returns {Promise<Array>} Array of posts
 */
export const getAllPosts = async ({ offset = 0, limit = 10, filter = 'for_you' } = {}) => {
  const response = await axiosInstance.get(`/posts?offset=${offset}&limit=${limit}&filter=${filter}`);
  return response.data.data;
};

/**
 * Get a single post by ID
 * @param {number} id - Post ID
 * @returns {Promise<Object>} Post object
 */
export const getPostById = async (id) => {
  const response = await axiosInstance.get(`/posts/${id}`);
  return response.data.data;
};

/**
 * Create a new post
 * @param {Object} data - Post data
 * @returns {Promise<Object>} Created post
 */
export const createPost = async (data) => {
  const response = await axiosInstance.post('/posts', data);
  return response.data.data;
};

/**
 * Update an existing post
 * @param {number} id - Post ID
 * @param {Object} data - Updated post data
 * @returns {Promise<Object>} Updated post
 */
export const updatePost = async (id, data) => {
  const response = await axiosInstance.put(`/posts/${id}`, data);
  return response.data.data;
};

/**
 * Delete a post
 * @param {number} id - Post ID
 * @returns {Promise<boolean>} Success status
 */
export const deletePost = async (id) => {
  const response = await axiosInstance.delete(`/posts/${id}`);
  return response.data.data;
};
