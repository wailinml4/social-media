import axiosInstance from '../config/api';

import { profileData } from '../data/profile';

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

export const getUserPosts = async (userId, { offset = 0, limit = 10 } = {}) => {
  const response = await axiosInstance.get(`/posts/user/${userId}?offset=${offset}&limit=${limit}`);
  return response.data.data;
};

export const getUserBookmarks = async (userId, { offset = 0, limit = 10 } = {}) => {
  const response = await axiosInstance.get(`/posts/bookmarked/${userId}?offset=${offset}&limit=${limit}`);
  return response.data.data;
};

export const getSuggestedUsers = async ({ limit = 5 } = {}) => {
  const response = await axiosInstance.get(`/users/suggested?limit=${limit}`);
  return response.data.data;
};
