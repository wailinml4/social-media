import express from 'express'
import authenticate from '../middleware/authenticate.js'
import { createStory, getStories, getUserStories, markStoryViewed, deleteStorySlide } from '../controllers/storyController.js'
import { validate } from '../middleware/validation.middleware.js'
import {
  createStorySchema,
  viewStorySchema,
  reactToStorySchema,
  replyToStorySchema,
  deleteStorySchema,
  getStoriesSchema,
  getMyStoriesSchema,
} from '../schemas/chat.schema.js'
import { storyIdParamSchema, userIdParamSchema } from '../schemas/common.schema.js'

const router = express.Router()

router.post('/', authenticate, validate(createStorySchema), createStory)
router.get('/', authenticate, validate(getStoriesSchema, 'query'), getStories)
router.get('/user/:userId', authenticate, validate(userIdParamSchema, 'params'), getUserStories)
router.patch('/:storyId/view', authenticate, validate(storyIdParamSchema, 'params'), validate(viewStorySchema), markStoryViewed)
router.delete('/:storyId', authenticate, validate(storyIdParamSchema, 'params'), deleteStorySlide)

export default router
