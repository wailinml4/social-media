import {
  createNotificationService,
  getAllNotificationsService,
  markAsReadService,
  markAllAsReadService,
  deleteNotificationService,
} from '../services/notificationService.js'

export const createNotification = async (req, res, next) => {
  try {
    const { recipientId, type, postId, commentId } = req.body
    const senderId = req.user.userId

    if (!recipientId || !type) {
      return res.status(400).json({
        success: false,
        message: 'Recipient ID and type are required',
      })
    }

    const notification = await createNotificationService(
      recipientId,
      senderId,
      type,
      postId,
      commentId,
    )

    return res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: notification,
    })
  } catch (error) {
    next(error)
  }
}

export const getAllNotifications = async (req, res, next) => {
  try {
    const userId = req.user.userId
    const { page = 1, limit = 20 } = req.query

    const result = await getAllNotificationsService(userId, parseInt(page), parseInt(limit))

    return res.status(200).json({
      success: true,
      message: 'Notifications retrieved successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const markAsRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params
    const userId = req.user.userId

    const notification = await markAsReadService(notificationId, userId)

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification,
    })
  } catch (error) {
    next(error)
  }
}

export const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.userId

    const result = await markAllAsReadService(userId)

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.params
    const userId = req.user.userId

    const result = await deleteNotificationService(notificationId, userId)

    return res.status(200).json({
      success: true,
      message: result.message,
    })
  } catch (error) {
    next(error)
  }
}
