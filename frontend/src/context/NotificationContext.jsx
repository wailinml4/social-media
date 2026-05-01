import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { getAllNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from "../services/notificationService.js"
import { useAuth } from "./AuthContext"
import { useSocket } from "./SocketContext"
import toast from "react-hot-toast"

export const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)
  const [isMarkingAsRead, setIsMarkingAsRead] = useState(false)
  const [isMarkingAllAsRead, setIsMarkingAllAsRead] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState(null)

  const { isAuthenticated } = useAuth()
  const { isConnected, onNotification, offNotification } = useSocket()

  const fetchNotifications = useCallback(async ({ page = 1, limit = 20 } = {}) => {
    try {
      setIsLoadingNotifications(true)
      const response = await getAllNotifications(page, limit)
      setNotifications(response.notifications || [])
      setUnreadCount(response.pagination?.unreadCount || 0)
      setError(null)
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setIsLoadingNotifications(false)
    }
  }, [])

  const markAsRead = useCallback(async (notificationId) => {
    try {
      setIsMarkingAsRead(true)
      await markNotificationAsRead(notificationId)
      setNotifications(prev => prev.map(notif => (notif._id === notificationId || notif.id === notificationId) ? { ...notif, isRead: true } : notif))
      setUnreadCount(prev => Math.max(0, prev - 1))
      setError(null)
    } catch (error) {
      setError(error.message)
      throw error
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
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setIsMarkingAllAsRead(false)
    }
  }, [])

  const deleteNotificationItem = useCallback(async (notificationId) => {
    try {
      setIsDeleting(true)
      await deleteNotification(notificationId)
      setNotifications(prev => prev.filter(notif => notif._id !== notificationId && notif.id !== notificationId))
      const deletedNotif = notifications.find(notif => notif._id === notificationId || notif.id === notificationId)
      if (deletedNotif && !deletedNotif.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
      setError(null)
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setIsDeleting(false)
    }
  }, [notifications])

  // Listen for real-time notifications via socket
  useEffect(() => {
    if (isConnected) {
      onNotification((notification) => {
        setNotifications(prev => [notification, ...prev])
        setUnreadCount(prev => prev + 1)
        toast(`${notification.sender.name} ${notification.type === 'like' ? 'liked your post' : notification.type === 'comment' ? 'commented on your post' : notification.type === 'follow' ? 'followed you' : 'mentioned you'}`)
      })

      return () => {
        offNotification()
      }
    }
  }, [isConnected, onNotification, offNotification])

  // Initial fetch when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications({ page: 1, limit: 20 })
    }
  }, [isAuthenticated, fetchNotifications])

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      isLoadingNotifications,
      isMarkingAsRead,
      isMarkingAllAsRead,
      isDeleting,
      error,
      fetchNotifications,
      markAsRead,
      markAllAsRead,
      deleteNotification: deleteNotificationItem,
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
