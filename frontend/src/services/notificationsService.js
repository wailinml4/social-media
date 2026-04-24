import { USE_MOCK_API, simulateDelay, simulateError } from '../config/api';

import { mockNotifications } from '../data/notifications';

/**
 * Get all notifications
 * @returns {Promise<Array>} Array of notifications
 */
export const getAllNotifications = async () => {
  if (USE_MOCK_API) {
    await simulateDelay();
    simulateError();
    return mockNotifications;
  }
  // Real API call would go here
};

/**
 * Get a single notification by ID
 * @param {number} id - Notification ID
 * @returns {Promise<Object>} Notification object
 */
export const getNotificationById = async (id) => {
  if (USE_MOCK_API) {
    await simulateDelay();
    simulateError();
    return mockNotifications.find(notification => notification.id === id);
  }
  // Real API call would go here
};

/**
 * Mark a notification as read
 * @param {number} id - Notification ID
 * @returns {Promise<Object>} Updated notification
 */
export const markNotificationAsRead = async (id) => {
  if (USE_MOCK_API) {
    await simulateDelay();
    simulateError();
    const notification = mockNotifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
    }
    return notification;
  }
  // Real API call would go here
};

/**
 * Mark all notifications as read
 * @returns {Promise<boolean>} Success status
 */
export const markAllNotificationsAsRead = async () => {
  if (USE_MOCK_API) {
    await simulateDelay();
    simulateError();
    mockNotifications.forEach(notification => {
      notification.read = true;
    });
    return true;
  }
  // Real API call would go here
};

/**
 * Delete a notification
 * @param {number} id - Notification ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteNotification = async (id) => {
  if (USE_MOCK_API) {
    await simulateDelay();
    simulateError();
    const index = mockNotifications.findIndex(notification => notification.id === id);
    if (index !== -1) {
      mockNotifications.splice(index, 1);
      return true;
    }
    return false;
  }
  // Real API call would go here
};
