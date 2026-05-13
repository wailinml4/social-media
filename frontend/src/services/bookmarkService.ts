import type { PaginatedResponse, PaginationOptions } from '../types'
import type { Post } from '../types'
import axiosInstance from '../config/api.js'

export const bookmarkPost = async (postId: string): Promise<void> => {
  const response = await axiosInstance.post(`/posts/${postId}/bookmarks`)
  return response.data
}

export const unbookmarkPost = async (postId: string): Promise<void> => {
  const response = await axiosInstance.delete(`/posts/${postId}/bookmarks`)
  return response.data
}

export const getUserBookmarkedPosts = async ({ page = 1, limit = 10 }: PaginationOptions = {}): Promise<PaginatedResponse<Post>> => {
  const response = await axiosInstance.get(`/posts/bookmarked?page=${page}&limit=${limit}`)
  return response.data.data
}

export const getPostBookmarkCount = async (postId: string): Promise<number> => {
  const response = await axiosInstance.get(`/posts/${postId}/bookmarks/count`)
  return response.data.data.bookmarkCount
}

export const checkBookmarkStatus = async (postId: string): Promise<boolean> => {
  const response = await axiosInstance.get(`/posts/${postId}/bookmarks/status`)
  return response.data.data.isBookmarked
}
