import axiosInstance from '../config/api';

export const getAllNotifications = async (page = 1, limit = 20) => {
  const response = await axiosInstance.get('/notifications', {
    params: { page, limit },
  });
  return response.data.data;
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await axiosInstance.put(`/notifications/${notificationId}/read`);
  return response.data.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await axiosInstance.put('/notifications/read-all');
  return response.data.data;
};

export const deleteNotification = async (notificationId) => {
  const response = await axiosInstance.delete(`/notifications/${notificationId}`);
  return response.data.data;
};
