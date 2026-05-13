import type { PaginatedResponse, CommentsResponse, RepliesResponse } from '../types'
import type { Comment } from '../types'
import axiosInstance from '../config/api.js'

export const createComment = async (postId: string, content: string, parentId: string | null = null): Promise<Comment> => {
  const response = await axiosInstance.post(`/posts/${postId}/comments`, {
    content,
    parentId,
  })
  return response.data.data
}

export const getPostComments = async (postId: string, page: number = 1, limit: number = 20): Promise<CommentsResponse<Comment>> => {
  const response = await axiosInstance.get(`/posts/${postId}/comments`, {
    params: { page, limit },
  })
  return response.data.data
}

export const getCommentReplies = async (commentId: string, page: number = 1, limit: number = 10): Promise<RepliesResponse<Comment>> => {
  const response = await axiosInstance.get(`/comments/${commentId}/replies`, {
    params: { page, limit },
  })
  return response.data.data
}

export const updateComment = async (commentId: string, content: string): Promise<Comment> => {
  const response = await axiosInstance.put(`/comments/${commentId}`, {
    content,
  })
  return response.data.data
}

export const deleteComment = async (commentId: string): Promise<void> => {
  const response = await axiosInstance.delete(`/comments/${commentId}`)
  return response.data
}
