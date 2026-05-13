import type { PaginatedResponse, PaginationOptions, PostListOptions, PostPayload, UserPostOptions, PostsResponse } from '../types'
import type { Post } from '../types'
import axiosInstance from '../config/api.js'

export const getAllPosts = async ({ page = 1, limit = 10, filter = 'for_you' }: PostListOptions = {}): Promise<PostsResponse<Post>> => {
  const response = await axiosInstance.get(`/posts?page=${page}&limit=${limit}&filter=${filter}`)
  return response.data.data
}

export const getFollowingPosts = async ({ page = 1, limit = 10 }: PaginationOptions = {}): Promise<PostsResponse<Post>> => {
  const response = await axiosInstance.get(`/posts/following?page=${page}&limit=${limit}`)
  return response.data.data
}

export const getFriendsPosts = async ({ page = 1, limit = 10 }: PaginationOptions = {}): Promise<PostsResponse<Post>> => {
  const response = await axiosInstance.get(`/posts/friends?page=${page}&limit=${limit}`)
  return response.data.data
}

export const getExplorePosts = async ({ page = 1, limit = 10 }: PaginationOptions = {}): Promise<PostsResponse<Post>> => {
  const response = await axiosInstance.get(`/posts/explore?page=${page}&limit=${limit}`)
  return response.data.data
}

export const getPostById = async (id: string): Promise<Post> => {
  const response = await axiosInstance.get(`/posts/${id}`)
  return response.data.data
}

export const createPost = async (data: PostPayload): Promise<Post> => {
  const response = await axiosInstance.post('/posts', data)
  return response.data.data
}

export const updatePost = async (id: string, data: PostPayload): Promise<Post> => {
  const response = await axiosInstance.put(`/posts/${id}`, data)
  return response.data.data
}

export const deletePost = async (id: string): Promise<void> => {
  const response = await axiosInstance.delete(`/posts/${id}`)
  return response.data.data
}

export const getUserPosts = async ({ userId, page = 1, limit = 10 }: UserPostOptions = {}): Promise<PostsResponse<Post>> => {
  const response = await axiosInstance.get(`/posts/user/${userId}?page=${page}&limit=${limit}`)
  return response.data.data
}

export const getBookmarkedPosts = async ({ page = 1, limit = 10 }: PaginationOptions = {}): Promise<PostsResponse<Post>> => {
  const response = await axiosInstance.get(`/posts/bookmarked?page=${page}&limit=${limit}`)
  return response.data.data
}

export const getLikedPosts = async ({ page = 1, limit = 10 }: PaginationOptions = {}): Promise<PostsResponse<Post>> => {
  const response = await axiosInstance.get(`/posts/liked?page=${page}&limit=${limit}`)
  return response.data.data
}
