import type {
  PaginatedResponse,
  PaginationOptions,
  ProfileUpdatePayload,
  SearchUsersOptions,
  UsersResponse,
  SearchUsersResponse,
} from '../types'
import type { User } from '../types'
import axiosInstance from '../config/api.js'

export const getCurrentProfile = async (): Promise<User> => {
  const response = await axiosInstance.get('/users/me/profile')
  return response.data.data
}

export const getProfileById = async (userId: string): Promise<User> => {
  const response = await axiosInstance.get(`/users/${userId}/profile`)
  return response.data.data
}

export const updateProfile = async (data: ProfileUpdatePayload): Promise<User> => {
  const response = await axiosInstance.put('/users/me/profile', data)
  return response.data.data
}

export const getUserPosts = async (userId: string, { page = 1, limit = 10 }: PaginationOptions = {}): Promise<PaginatedResponse<User>> => {
  const response = await axiosInstance.get(`/posts/user/${userId}?page=${page}&limit=${limit}`)
  return response.data.data
}

export const getUserBookmarks = async (
  userId: string,
  { page = 1, limit = 10 }: PaginationOptions = {},
): Promise<PaginatedResponse<User>> => {
  const response = await axiosInstance.get(`/posts/bookmarked/${userId}?page=${page}&limit=${limit}`)
  return response.data.data
}

export const getSuggestedUsers = async ({ page = 1, limit = 5 }: PaginationOptions = {}): Promise<UsersResponse<User>> => {
  const response = await axiosInstance.get(`/users/suggested?page=${page}&limit=${limit}`)
  return response.data.data
}

export const searchUsers = async ({ query = '', limit = 10 }: SearchUsersOptions = {}): Promise<SearchUsersResponse<User>> => {
  const response = await axiosInstance.get(`/users/search?query=${encodeURIComponent(query)}&limit=${limit}`)
  return response.data.data
}
