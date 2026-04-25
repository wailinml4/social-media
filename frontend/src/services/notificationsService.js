import axiosInstance from '../config/api';

import { mockNotifications } from '../data/notifications';

export const getAllNotifications = async () => {
  const response = await axiosInstance.get('/notifications');
  return response.data.data;
};

export const getNotificationById = async (id) => {
  const response = await axiosInstance.get(`/notifications/${id}`);
  return response.data.data;
};

export const markNotificationAsRead = async (id) => {
  const response = await axiosInstance.put(`/notifications/${id}/read`);
  return response.data.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await axiosInstance.put('/notifications/read-all');
  return response.data.data;
};

export const deleteNotification = async (id) => {
  const response = await axiosInstance.delete(`/notifications/${id}`);
  return response.data.data;
};
