import express from "express"
import authenticate from "../middleware/authenticate.js"
import {
  createMessage,
  getConversationMessages,
  markAsRead,
  markConversationAsRead,
} from "../controllers/messageController.js"

const router = express.Router()

router.post('/', authenticate, createMessage)
router.get('/conversation/:conversationId', authenticate, getConversationMessages)
router.put('/:messageId/read', authenticate, markAsRead)
router.put('/conversation/:conversationId/read', authenticate, markConversationAsRead)

export default router
