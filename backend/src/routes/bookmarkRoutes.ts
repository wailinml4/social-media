import express from 'express'
import {
  bookmarkPost,
  unbookmarkPost,
  getUserBookmarkedPosts,
  getPostBookmarkCount,
  checkBookmarkStatus,
} from '../controllers/bookmarkController.js'
import authenticate from '../middleware/authenticate.js'
import { validate } from '../middleware/validation.middleware.js'
import { postIdParamSchema, paginationSchema } from '../schemas/common.schema.js'

const router = express.Router()

router.post('/posts/:postId/bookmarks', authenticate, validate(postIdParamSchema, 'params'), bookmarkPost)
router.delete('/posts/:postId/bookmarks', authenticate, validate(postIdParamSchema, 'params'), unbookmarkPost)
router.get('/posts/bookmarked', authenticate, validate(paginationSchema, 'query'), getUserBookmarkedPosts)
router.get('/posts/:postId/bookmarks/count', authenticate, validate(postIdParamSchema, 'params'), getPostBookmarkCount)
router.get('/posts/:postId/bookmarks/status', authenticate, validate(postIdParamSchema, 'params'), checkBookmarkStatus)

export default router
