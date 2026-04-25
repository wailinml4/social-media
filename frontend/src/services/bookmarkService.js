import axiosInstance from '../config/api';

export const bookmarkPost = async (postId) => {
  const response = await axiosInstance.post(`/posts/${postId}/bookmark`);
  return response.data;
};

export const unbookmarkPost = async (postId) => {
  const response = await axiosInstance.delete(`/posts/${postId}/bookmark`);
  return response.data;
};

export const getUserBookmarkedPosts = async ({ offset = 0, limit = 10 } = {}) => {
  const response = await axiosInstance.get(`/posts/bookmarked?offset=${offset}&limit=${limit}`);
  return response.data.data;
};

export const getPostBookmarkCount = async (postId) => {
  const response = await axiosInstance.get(`/posts/${postId}/bookmarks/count`);
  return response.data.data.bookmarkCount;
};

export const checkBookmarkStatus = async (postId) => {
  const response = await axiosInstance.get(`/posts/${postId}/bookmarks/status`);
  return response.data.data.isBookmarked;
};
