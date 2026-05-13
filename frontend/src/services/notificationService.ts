import type { NotificationsResponse } from '../types'
import type { Notification } from '../types'
import axiosInstance from '../config/api.js'

export const getAllNotifications = async (page: number = 1, limit: number = 20): Promise<NotificationsResponse<Notification>> => {
  const response = await axiosInstance.get('/notifications', {
    params: { page, limit },
  })
  return response.data.data
}

export const markNotificationAsRead = async (notificationId: string): Promise<Notification> => {
  const response = await axiosInstance.put(`/notifications/${notificationId}/read`)
  return response.data.data
}

export const markAllNotificationsAsRead = async (): Promise<void> => {
  const response = await axiosInstance.put('/notifications/read-all')
  return response.data.data
}

export const deleteNotification = async (notificationId: string): Promise<void> => {
  const response = await axiosInstance.delete(`/notifications/${notificationId}`)
  return response.data.data
}

export const deleteAllNotifications = async (): Promise<void> => {
  const response = await axiosInstance.delete('/notifications')
  return response.data.data
}
