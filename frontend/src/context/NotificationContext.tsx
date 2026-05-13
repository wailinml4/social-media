/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { Notification as AppNotification } from '../types'
import type { NotificationsResponse } from '../types'
import {
  getAllNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
} from '../services/notificationService.js'
import { useAuth } from './AuthContext.jsx'
import { useSocket } from './SocketContext.jsx'
import toast from 'react-hot-toast'

interface NotificationContextValue {
  notifications: AppNotification[]
  unreadCount: number
  isLoadingNotifications: boolean
  isMarkingAsRead: boolean
  isMarkingAllAsRead: boolean
  isDeleting: boolean
  isDeletingAll: boolean
  error: string | null
  fetchNotifications: (options?: { page?: number; limit?: number }) => Promise<void>
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (notificationId: string) => Promise<void>
  deleteAllNotifications: () => Promise<void>
}

export const NotificationContext = createContext<NotificationContextValue | null>(null)

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)
  const [isMarkingAsRead, setIsMarkingAsRead] = useState(false)
  const [isMarkingAllAsRead, setIsMarkingAllAsRead] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeletingAll, setIsDeletingAll] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { isAuthenticated } = useAuth()
  const { isConnected, onNotification, offNotification } = useSocket()

  const fetchNotifications = useCallback(async ({ page = 1, limit = 20 }: { page?: number; limit?: number } = {}) => {
    try {
      setIsLoadingNotifications(true)
      const response = await getAllNotifications(page, limit)
      setNotifications(response.notifications || [])
      setUnreadCount(response.notifications?.filter((n: AppNotification) => !n.isRead).length || 0)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications')
      throw err
    } finally {
      setIsLoadingNotifications(false)
    }
  }, [])

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      setIsMarkingAsRead(true)
      await markNotificationAsRead(notificationId)
      setNotifications(prev => prev.map(notif => (notif._id === notificationId ? { ...notif, isRead: true } : notif)))
      setUnreadCount(prev => Math.max(0, prev - 1))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark as read')
      throw err
    } finally {
      setIsMarkingAsRead(false)
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      setIsMarkingAllAsRead(true)
      await markAllNotificationsAsRead()
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })))
      setUnreadCount(0)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark all as read')
      throw err
    } finally {
      setIsMarkingAllAsRead(false)
    }
  }, [])

  const deleteNotificationItem = useCallback(
    async (notificationId: string) => {
      try {
        setIsDeleting(true)
        await deleteNotification(notificationId)
        setNotifications(prev => prev.filter(notif => notif._id !== notificationId))
        const deletedNotif = notifications.find(notif => notif._id === notificationId)
        if (deletedNotif && !deletedNotif.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1))
        }
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete notification')
        throw err
      } finally {
        setIsDeleting(false)
      }
    },
    [notifications],
  )

  const deleteAllNotificationsItems = useCallback(async () => {
    try {
      setIsDeletingAll(true)
      await deleteAllNotifications()
      setNotifications([])
      setUnreadCount(0)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete all notifications')
      throw err
    } finally {
      setIsDeletingAll(false)
    }
  }, [])

  // Listen for real-time notifications via socket
  useEffect(() => {
    if (isConnected) {
      onNotification((data: { notification: AppNotification }) => {
        const { notification } = data
        setNotifications(prev => [notification, ...prev])
        setUnreadCount(prev => prev + 1)
        const notificationText =
          notification.type === 'like'
            ? 'liked your post'
            : notification.type === 'comment'
              ? 'commented on your post'
              : notification.type === 'follow'
                ? 'followed you'
                : notification.type === 'message'
                  ? 'sent you a message'
                  : notification.type === 'reply'
                    ? 'replied to your comment'
                    : 'mentioned you'
        toast(`${notification.sender?.fullName || 'Unknown User'} ${notificationText}`)
      })

      return () => {
        offNotification()
      }
    }
  }, [isConnected, onNotification, offNotification])

  // Initial fetch when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setTimeout(() => fetchNotifications({ page: 1, limit: 20 }), 0)
    }
  }, [isAuthenticated, fetchNotifications])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoadingNotifications,
        isMarkingAsRead,
        isMarkingAllAsRead,
        isDeleting,
        isDeletingAll,
        error,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification: deleteNotificationItem,
        deleteAllNotifications: deleteAllNotificationsItems,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = (): NotificationContextValue => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
