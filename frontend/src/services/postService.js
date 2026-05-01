import axiosInstance from '../config/api';

export const getAllPosts = async ({ page = 1, limit = 10, filter = 'for_you' } = {}) => {
  const response = await axiosInstance.get(`/posts?page=${page}&limit=${limit}&filter=${filter}`);
  return response.data.data;
};

export const getFollowingPosts = async ({ page = 1, limit = 10 } = {}) => {
  const response = await axiosInstance.get(`/posts/following?page=${page}&limit=${limit}`);
  return response.data.data;
};

export const getFriendsPosts = async ({ page = 1, limit = 10 } = {}) => {
  const response = await axiosInstance.get(`/posts/friends?page=${page}&limit=${limit}`);
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

export const getUserPosts = async ({ userId, page = 1, limit = 10 } = {}) => {
  const response = await axiosInstance.get(`/posts/user/${userId}?page=${page}&limit=${limit}`);
  return response.data.data;
};

export const getBookmarkedPosts = async ({ userId, page = 1, limit = 10 } = {}) => {
  const response = await axiosInstance.get(`/posts/bookmarked/${userId}?page=${page}&limit=${limit}`);
  return response.data.data;
};
