import express from 'express'
import { likePost, unlikePost, getPostLikeCount, checkLikeStatus } from '../controllers/likeController.js'
import authenticate from '../middleware/authenticate.js'
import { postIdParamSchema } from '../schemas/common.schema.js'
import { validate } from '../middleware/validation.middleware.js'

const router = express.Router()

router.post('/posts/:postId/likes', authenticate, validate(postIdParamSchema, 'params'), likePost)
router.delete('/posts/:postId/likes', authenticate, validate(postIdParamSchema, 'params'), unlikePost)
router.get('/posts/:postId/likes/count', authenticate, validate(postIdParamSchema, 'params'), getPostLikeCount)
router.get('/posts/:postId/likes/status', authenticate, validate(postIdParamSchema, 'params'), checkLikeStatus)

export default router
