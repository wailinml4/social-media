import axiosInstance from '../config/api';

import { mockPostsDB } from '../data/posts';

export const getAllPosts = async ({ offset = 0, limit = 10, filter = 'for_you' } = {}) => {
  const response = await axiosInstance.get(`/posts?offset=${offset}&limit=${limit}&filter=${filter}`);
  return response.data.data;
};

export const getFollowingPosts = async ({ offset = 0, limit = 10 } = {}) => {
  const response = await axiosInstance.get(`/posts/following?offset=${offset}&limit=${limit}`);
  return response.data.data;
};

export const getFriendsPosts = async ({ offset = 0, limit = 10 } = {}) => {
  const response = await axiosInstance.get(`/posts/friends?offset=${offset}&limit=${limit}`);
  return response.data.data;
};

export const getPostById = async (id) => {
  const response = await axiosInstance.get(`/posts/${id}`);
  return response.data.data;
};

export const createPost = async (data) => {
  const response = await axiosInstance.post('/posts', data);
  return response.data.data;
};

export const updatePost = async (id, data) => {
  const response = await axiosInstance.put(`/posts/${id}`, data);
  return response.data.data;
};

export const deletePost = async (id) => {
  const response = await axiosInstance.delete(`/posts/${id}`);
  return response.data.data;
};

export const getUserPosts = async ({ userId, offset = 0, limit = 10 } = {}) => {
  const response = await axiosInstance.get(`/posts/user/${userId}?offset=${offset}&limit=${limit}`);
  return response.data.data;
};

export const getBookmarkedPosts = async ({ userId, offset = 0, limit = 10 } = {}) => {
  const response = await axiosInstance.get(`/posts/bookmarked/${userId}?offset=${offset}&limit=${limit}`);
  return response.data.data;
};
