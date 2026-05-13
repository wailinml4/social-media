import express from 'express'
import authenticate from '../middleware/authenticate.js'
import {
  createMessage,
  getConversationMessages,
  markAsRead,
  markConversationAsRead,
  updateMessage,
  deleteMessage,
} from '../controllers/messageController.js'
import { validate } from '../middleware/validation.middleware.js'
import {
  sendMessageSchema,
  getMessagesSchema,
  deleteMessageSchema,
  editMessageSchema,
  markMessagesAsReadSchema,
} from '../schemas/chat.schema.js'
import { messageIdParamSchema, conversationIdParamSchema } from '../schemas/common.schema.js'

const router = express.Router()

router.post('/', authenticate, validate(sendMessageSchema), createMessage)
router.get('/conversation/:conversationId', authenticate, validate(conversationIdParamSchema, 'params'), validate(getMessagesSchema, 'query'), getConversationMessages)
router.put('/:messageId/read', authenticate, validate(messageIdParamSchema, 'params'), markAsRead)
router.put('/conversation/:conversationId/read', authenticate, validate(conversationIdParamSchema, 'params'), markConversationAsRead)
router.put('/:messageId', authenticate, validate(messageIdParamSchema, 'params'), validate(editMessageSchema), updateMessage)
router.delete('/:messageId', authenticate, validate(messageIdParamSchema, 'params'), validate(deleteMessageSchema), deleteMessage)

export default router
