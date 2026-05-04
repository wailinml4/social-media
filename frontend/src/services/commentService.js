import axiosInstance from '../config/api'

export const createComment = async (postId, content, parentId = null) => {
  const response = await axiosInstance.post(`/posts/${postId}/comments`, {
    content,
    parentId,
  })
  return response.data.data
}

export const getPostComments = async (postId, page = 1, limit = 20) => {
  const response = await axiosInstance.get(`/posts/${postId}/comments`, {
    params: { page, limit },
  })
  return response.data.data
}

export const getCommentReplies = async (commentId, page = 1, limit = 10) => {
  const response = await axiosInstance.get(`/comments/${commentId}/replies`, {
    params: { page, limit },
  })
  return response.data.data
}

export const updateComment = async (commentId, content) => {
  const response = await axiosInstance.put(`/comments/${commentId}`, {
    content,
  })
  return response.data.data
}

export const deleteComment = async commentId => {
  const response = await axiosInstance.delete(`/comments/${commentId}`)
  return response.data
}
