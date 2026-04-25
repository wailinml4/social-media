import axiosInstance from '../config/api';

import { mockComments } from '../data/comments';

export const getCommentsByPostId = async (postId) => {
  const response = await axiosInstance.get(`/comments/post/${postId}`);
  return response.data.data;
};

export const getCommentById = async (id) => {
  const response = await axiosInstance.get(`/comments/${id}`);
  return response.data.data;
};

export const createComment = async (data) => {
  const response = await axiosInstance.post('/comments', data);
  return response.data.data;
};

export const updateComment = async (id, data) => {
  const response = await axiosInstance.put(`/comments/${id}`, data);
  return response.data.data;
};

export const deleteComment = async (id) => {
  const response = await axiosInstance.delete(`/comments/${id}`);
  return response.data.data;
};
