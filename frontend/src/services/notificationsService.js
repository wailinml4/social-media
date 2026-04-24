import axiosInstance from '../config/api';

import { mockNotifications } from '../data/notifications';

/**
 * Get all notifications
 * @returns {Promise<Array>} Array of notifications
 */
export const getAllNotifications = async () => {
  const response = await axiosInstance.get('/notifications');
  return response.data.data;
};

/**
 * Get a single notification by ID
 * @param {number} id - Notification ID
 * @returns {Promise<Object>} Notification object
 */
export const getNotificationById = async (id) => {
  const response = await axiosInstance.get(`/notifications/${id}`);
  return response.data.data;
};

/**
 * Mark a notification as read
 * @param {number} id - Notification ID
 * @returns {Promise<Object>} Updated notification
 */
export const markNotificationAsRead = async (id) => {
  const response = await axiosInstance.put(`/notifications/${id}/read`);
  return response.data.data;
};

/**
 * Mark all notifications as read
 * @returns {Promise<boolean>} Success status
 */
export const markAllNotificationsAsRead = async () => {
  const response = await axiosInstance.put('/notifications/read-all');
  return response.data.data;
};

/**
 * Delete a notification
 * @param {number} id - Notification ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteNotification = async (id) => {
  const response = await axiosInstance.delete(`/notifications/${id}`);
  return response.data.data;
};
