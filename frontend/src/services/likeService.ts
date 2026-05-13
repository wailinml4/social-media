import axiosInstance from '../config/api.js'

export const likePost = async (postId: string): Promise<void> => {
  const response = await axiosInstance.post(`/posts/${postId}/likes`)
  return response.data
}

export const unlikePost = async (postId: string): Promise<void> => {
  const response = await axiosInstance.delete(`/posts/${postId}/likes`)
  return response.data
}

export const getPostLikeCount = async (postId: string): Promise<number> => {
  const response = await axiosInstance.get(`/posts/${postId}/likes/count`)
  return response.data.data.likeCount
}

export const checkLikeStatus = async (postId: string): Promise<boolean> => {
  const response = await axiosInstance.get(`/posts/${postId}/likes/status`)
  return response.data.data.isLiked
}
