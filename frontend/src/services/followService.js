import axiosInstance from '../config/api'

export const followUser = async userId => {
  const response = await axiosInstance.post(`/follow/${userId}/follow`)
  return response.data
}

export const unfollowUser = async userId => {
  const response = await axiosInstance.delete(`/follow/${userId}/follow`)
  return response.data
}

export const getFollowers = async (userId, page = 1, limit = 10) => {
  const response = await axiosInstance.get(`/follow/${userId}/followers`, {
    params: { page, limit },
  })
  return response.data
}

export const getFollowees = async (userId, page = 1, limit = 10) => {
  const response = await axiosInstance.get(`/follow/${userId}/following`, {
    params: { page, limit },
  })
  return response.data
}

export const checkFollowStatus = async userId => {
  const response = await axiosInstance.get(`/follow/${userId}/follow-status`)
  return response.data
}

export const getFriends = async (userId, page = 1, limit = 10) => {
  const response = await axiosInstance.get(`/follow/${userId}/friends`, {
    params: { page, limit },
  })
  return response.data
}
