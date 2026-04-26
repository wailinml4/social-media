import express from 'express';
import authenticate from '../middleware/authenticate.js';
import {
  createConversation,
  getConversation,
  getUserConversations,
  markAsRead,
} from '../controllers/conversationController.js';

const router = express.Router();

router.post('/', authenticate, createConversation);
router.get('/', authenticate, getUserConversations);
router.get('/:id', authenticate, getConversation);
router.put('/:id/read', authenticate, markAsRead);

export default router;
