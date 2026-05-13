import express from 'express'
import {
  createNotification,
  getAllNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} from '../controllers/notificationController.js'
import authenticate from '../middleware/authenticate.js'
import { validate } from '../middleware/validation.middleware.js'
import { notificationIdParamSchema, paginationSchema } from '../schemas/common.schema.js'
import { createNotificationSchema } from '../schemas/notification.schema.js'

const router = express.Router()

router.post('/', authenticate, validate(createNotificationSchema), createNotification)
router.get('/', authenticate, validate(paginationSchema, 'query'), getAllNotifications)
router.put('/:notificationId/read', authenticate, validate(notificationIdParamSchema, 'params'), markAsRead)
router.put('/read-all', authenticate, markAllAsRead)
router.delete('/:notificationId', authenticate, validate(notificationIdParamSchema, 'params'), deleteNotification)
router.delete('/', authenticate, deleteAllNotifications)

export default router
