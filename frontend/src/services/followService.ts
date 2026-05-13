import type { PaginatedResponse, PaginationOptions, FollowersResponse, FolloweesResponse, FriendsResponse } from '../types'
import type { User } from '../types'
import axiosInstance from '../config/api.js'

export const followUser = async (userId: string): Promise<void> => {
  const response = await axiosInstance.post(`/follow/${userId}/follow`)
  return response.data
}

export const unfollowUser = async (userId: string): Promise<void> => {
  const response = await axiosInstance.delete(`/follow/${userId}/follow`)
  return response.data
}

export const getFollowers = async (userId: string, page: number = 1, limit: number = 10): Promise<FollowersResponse<User>> => {
  const response = await axiosInstance.get(`/follow/${userId}/followers`, {
    params: { page, limit },
  })
  return response.data
}

export const getFollowees = async (userId: string, page: number = 1, limit: number = 10): Promise<FolloweesResponse<User>> => {
  const response = await axiosInstance.get(`/follow/${userId}/following`, {
    params: { page, limit },
  })
  return response.data
}

export const checkFollowStatus = async (userId: string): Promise<{ isFollowing: boolean }> => {
  const response = await axiosInstance.get(`/follow/${userId}/follow-status`, {
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
  })
  return response.data.data
}

export const getFriends = async (userId: string, page: number = 1, limit: number = 10): Promise<FriendsResponse<User>> => {
  const response = await axiosInstance.get(`/follow/${userId}/friends`, {
    params: { page, limit },
  })
  return response.data
}
