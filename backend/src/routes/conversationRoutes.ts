import express from 'express'
import authenticate from '../middleware/authenticate.js'
import { createConversation, getConversation, getUserConversations, markAsRead } from '../controllers/conversationController.js'
import { validate } from '../middleware/validation.middleware.js'
import { createConversationSchema, getConversationsSchema } from '../schemas/chat.schema.js'
import { conversationIdParamSchema } from '../schemas/common.schema.js'

const router = express.Router()

router.post('/', authenticate, validate(createConversationSchema), createConversation)
router.get('/', authenticate, validate(getConversationsSchema, 'query'), getUserConversations)
router.get('/:conversationId', authenticate, validate(conversationIdParamSchema, 'params'), getConversation)
router.put('/:conversationId/read', authenticate, validate(conversationIdParamSchema, 'params'), markAsRead)

export default router
