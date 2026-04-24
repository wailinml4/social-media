import { USE_MOCK_API, simulateDelay, simulateError } from '../config/api';

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
  if (USE_MOCK_API) {
    await simulateDelay();
    simulateError();
    
    let filteredPosts = mockPostsDB;
    
    // Filter posts based on the tab
    if (filter === 'for_you') {
      // Return all posts, but shuffle them slightly for variety
      filteredPosts = [...mockPostsDB].sort(() => Math.random() - 0.5);
    } else if (filter === 'friends') {
      // Return posts from specific users (simulating friends)
      filteredPosts = mockPostsDB.filter(post => 
        ['Alice Johnson', 'David Smith', 'Emma Wilson', 'Sarah Chen'].includes(post.name)
      );
    } else if (filter === 'following') {
      // Return posts from different users (simulating following)
      filteredPosts = mockPostsDB.filter(post => 
        ['Tech Insider', 'Frontend Daily', 'Jessica Wang', 'Kevin Hart'].includes(post.name)
      );
    }
    
    return filteredPosts.slice(offset, offset + limit);
  }
  // Real API call would go here
};

/**
 * Get a single post by ID
 * @param {number} id - Post ID
 * @returns {Promise<Object>} Post object
 */
export const getPostById = async (id) => {
  if (USE_MOCK_API) {
    await simulateDelay();
    simulateError();
    return mockPostsDB.find(post => post.id === id);
  }
  // Real API call would go here
};

/**
 * Create a new post
 * @param {Object} data - Post data
 * @returns {Promise<Object>} Created post
 */
export const createPost = async (data) => {
  if (USE_MOCK_API) {
    await simulateDelay();
    simulateError();
    const newPost = { id: Date.now(), ...data };
    mockPostsDB.unshift(newPost);
    return newPost;
  }
  // Real API call would go here
};

/**
 * Update an existing post
 * @param {number} id - Post ID
 * @param {Object} data - Updated post data
 * @returns {Promise<Object>} Updated post
 */
export const updatePost = async (id, data) => {
  if (USE_MOCK_API) {
    await simulateDelay();
    simulateError();
    const index = mockPostsDB.findIndex(post => post.id === id);
    if (index !== -1) {
      mockPostsDB[index] = { ...mockPostsDB[index], ...data };
      return mockPostsDB[index];
    }
    return null;
  }
  // Real API call would go here
};

/**
 * Delete a post
 * @param {number} id - Post ID
 * @returns {Promise<boolean>} Success status
 */
export const deletePost = async (id) => {
  if (USE_MOCK_API) {
    await simulateDelay();
    simulateError();
    const index = mockPostsDB.findIndex(post => post.id === id);
    if (index !== -1) {
      mockPostsDB.splice(index, 1);
      return true;
    }
    return false;
  }
  // Real API call would go here
};
