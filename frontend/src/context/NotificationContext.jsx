import { createContext, useContext, useState, useEffect, useCallback } from "react"
import {
	getAllNotifications,
	markNotificationAsRead,
	markAllNotificationsAsRead,
	deleteNotification,
} from "../services/notificationsService.js"
import { useAuth } from "./AuthContext"

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

	const fetchNotifications = useCallback(async ({ offset = 0, limit = 20 } = {}) => {
		try {
			setIsLoadingNotifications(true)
			const response = await getAllNotifications(offset, limit)
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

	const fetchUnreadCount = useCallback(async () => {
		try {
			const response = await getAllNotifications(0, 1)
			setUnreadCount(response.pagination?.unreadCount || 0)
			setError(null)
		} catch (error) {
			setError(error.message)
		}
	}, [])

	const markAsRead = useCallback(async (notificationId) => {
		try {
			setIsMarkingAsRead(true)
			await markNotificationAsRead(notificationId)
			setNotifications(prev =>
				prev.map(notif =>
					(notif._id === notificationId || notif.id === notificationId)
						? { ...notif, isRead: true }
						: notif
				)
			)
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
			setNotifications(prev =>
				prev.map(notif => ({ ...notif, isRead: true }))
			)
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
			setNotifications(prev =>
				prev.filter(notif => notif._id !== notificationId && notif.id !== notificationId)
			)
			const deletedNotif = notifications.find(
				notif => notif._id === notificationId || notif.id === notificationId
			)
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

	// Poll for unread count every 30 seconds when authenticated
	useEffect(() => {
		if (isAuthenticated) {
			fetchUnreadCount()
			const interval = setInterval(fetchUnreadCount, 30000)
			return () => clearInterval(interval)
		}
	}, [isAuthenticated, fetchUnreadCount])

	return (
		<NotificationContext.Provider
			value={{
				notifications,
				unreadCount,
				isLoadingNotifications,
				isMarkingAsRead,
				isMarkingAllAsRead,
				isDeleting,
				error,
				fetchNotifications,
				fetchUnreadCount,
				markAsRead,
				markAllAsRead,
				deleteNotification: deleteNotificationItem,
			}}
		>
			{children}
		</NotificationContext.Provider>
	)
}

export const useNotifications = () => useContext(NotificationContext)
