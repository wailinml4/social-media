import Notification from "../models/Notification.js"
import User from "../models/User.js"
import Post from "../models/Post.js"
import Comment from "../models/Comment.js"

const formatTime = (date) => {
    const now = new Date()
    const diff = now - new Date(date)
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'now'
    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    return `${days}d`
}

export const createNotificationService = async (recipientId, senderId, type, postId = null, commentId = null) => {
    // Don't create notification if sender is the recipient
    if (recipientId.toString() === senderId.toString()) {
        return null
    }

    // Validate recipient exists
    const recipient = await User.findById(recipientId)
    if (!recipient) {
        const error = new Error("Recipient not found")
        error.statusCode = 404
        throw error
    }

    // Validate sender exists
    const sender = await User.findById(senderId)
    if (!sender) {
        const error = new Error("Sender not found")
        error.statusCode = 404
        throw error
    }

    // If post is provided, validate it exists
    if (postId) {
        const post = await Post.findById(postId)
        if (!post) {
            const error = new Error("Post not found")
            error.statusCode = 404
            throw error
        }
    }

    // If comment is provided, validate it exists
    if (commentId) {
        const comment = await Comment.findById(commentId)
        if (!comment) {
            const error = new Error("Comment not found")
            error.statusCode = 404
            throw error
        }
    }

    const notification = await Notification.create({
        recipient: recipientId,
        sender: senderId,
        type,
        post: postId,
        comment: commentId,
    })

    // Populate sender data
    await notification.populate("sender", "fullName email profilePicture")

    // Transform to match frontend expectations
    const transformedNotification = {
        _id: notification._id,
        id: notification._id,
        type: notification.type,
        isRead: notification.isRead,
        time: formatTime(notification.createdAt),
        sender: {
            _id: notification.sender._id,
            name: notification.sender.fullName,
            handle: notification.sender.email?.split('@')[0] || 'user',
            avatar: notification.sender.profilePicture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + notification.sender.fullName,
        },
        post: notification.post,
        comment: notification.comment,
    }

    return transformedNotification
}

export const getAllNotificationsService = async (recipientId, page = 1, limit = 20) => {
    const skip = (page - 1) * limit
    const notifications = await Notification.find({ recipient: recipientId })
        .populate("sender", "fullName email profilePicture")
        .populate("post", "content images")
        .populate("comment", "content")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)

    const total = await Notification.countDocuments({ recipient: recipientId })
    const unreadCount = await Notification.countDocuments({ recipient: recipientId, isRead: false })

    // Transform notifications to match frontend expectations
    const transformedNotifications = notifications.map(notification => ({
        _id: notification._id,
        id: notification._id,
        type: notification.type,
        isRead: notification.isRead,
        time: formatTime(notification.createdAt),
        sender: {
            _id: notification.sender._id,
            name: notification.sender.fullName,
            handle: notification.sender.email?.split('@')[0] || 'user',
            avatar: notification.sender.profilePicture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + notification.sender.fullName,
        },
        post: notification.post ? {
            _id: notification.post._id,
            content: notification.post.content,
            images: notification.post.images,
        } : null,
        comment: notification.comment ? {
            _id: notification.comment._id,
            content: notification.comment.content,
        } : null,
    }))

    return {
        notifications: transformedNotifications,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
            unreadCount,
        },
    }
}

export const markAsReadService = async (notificationId, userId) => {
    const notification = await Notification.findById(notificationId)
    if (!notification) {
        const error = new Error("Notification not found")
        error.statusCode = 404
        throw error
    }

    // Only the recipient can mark as read
    if (notification.recipient.toString() !== userId) {
        const error = new Error("You can only mark your own notifications as read")
        error.statusCode = 403
        throw error
    }

    notification.isRead = true
    await notification.save()

    // Populate sender data
    await notification.populate("sender", "fullName email profilePicture")

    // Transform to match frontend expectations
    const transformedNotification = {
        _id: notification._id,
        id: notification._id,
        type: notification.type,
        isRead: notification.isRead,
        time: formatTime(notification.createdAt),
        sender: {
            _id: notification.sender._id,
            name: notification.sender.fullName,
            handle: notification.sender.email?.split('@')[0] || 'user',
            avatar: notification.sender.profilePicture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + notification.sender.fullName,
        },
        post: notification.post,
        comment: notification.comment,
    }

    return transformedNotification
}

export const markAllAsReadService = async (userId) => {
    await Notification.updateMany(
        { recipient: userId, isRead: false },
        { isRead: true }
    )

    return { message: "All notifications marked as read" }
}

export const deleteNotificationService = async (notificationId, userId) => {
    const notification = await Notification.findById(notificationId)
    if (!notification) {
        const error = new Error("Notification not found")
        error.statusCode = 404
        throw error
    }

    // Only the recipient can delete
    if (notification.recipient.toString() !== userId) {
        const error = new Error("You can only delete your own notifications")
        error.statusCode = 403
        throw error
    }

    await Notification.findByIdAndDelete(notificationId)

    return { message: "Notification deleted successfully" }
}
