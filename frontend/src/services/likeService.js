import axiosInstance from '../config/api';

export const likePost = async (postId) => {
  const response = await axiosInstance.post(`/posts/${postId}/like`);
  return response.data;
};

export const unlikePost = async (postId) => {
  const response = await axiosInstance.delete(`/posts/${postId}/like`);
  return response.data;
};

export const getPostLikeCount = async (postId) => {
  const response = await axiosInstance.get(`/posts/${postId}/likes/count`);
  return response.data.data.likeCount;
};

export const checkLikeStatus = async (postId) => {
  const response = await axiosInstance.get(`/posts/${postId}/likes/status`);
  return response.data.data.isLiked;
};
