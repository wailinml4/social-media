import express from 'express'
import authenticate from '../middleware/authenticate.js'
import {
  createStory,
  getStories,
  getUserStories,
  markStoryViewed,
  deleteStorySlide,
} from '../controllers/storyController.js'

const router = express.Router()

router.post('/', authenticate, createStory)
router.get('/', authenticate, getStories)
router.get('/user/:userId', authenticate, getUserStories)
router.patch('/:storyId/view', authenticate, markStoryViewed)
router.delete('/slide/:slideId', authenticate, deleteStorySlide)

export default router
