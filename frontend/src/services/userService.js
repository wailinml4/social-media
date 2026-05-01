import axiosInstance from '../config/api';

export const getCurrentProfile = async () => {
  const response = await axiosInstance.get('/users/me/profile');
  return response.data.data;
};

export const getProfileById = async (userId) => {
  const response = await axiosInstance.get(`/users/${userId}/profile`);
  return response.data.data;
};

export const updateProfile = async (userId, data) => {
  const response = await axiosInstance.put('/users/me/profile', data);
  return response.data.data;
};

export const getUserPosts = async (userId, { page = 1, limit = 10 } = {}) => {
  const response = await axiosInstance.get(`/posts/user/${userId}?page=${page}&limit=${limit}`);
  return response.data.data;
};

export const getUserBookmarks = async (userId, { page = 1, limit = 10 } = {}) => {
  const response = await axiosInstance.get(`/posts/bookmarked/${userId}?page=${page}&limit=${limit}`);
  return response.data.data;
};

export const getSuggestedUsers = async ({ page = 1, limit = 5 } = {}) => {
  const response = await axiosInstance.get(`/users/suggested?page=${page}&limit=${limit}`);
  return response.data.data;
};

export const searchUsers = async ({ query = '', limit = 10 } = {}) => {
  const response = await axiosInstance.get(`/users/search?query=${encodeURIComponent(query)}&limit=${limit}`);
  return response.data.data;
};
