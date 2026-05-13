import express from 'express'
import { createComment, getPostComments, getCommentReplies, updateComment, deleteComment } from '../controllers/commentController.js'
import authenticate from '../middleware/authenticate.js'
import { validate } from '../middleware/validation.middleware.js'
import { createCommentSchema, editCommentSchema, deleteCommentSchema, getPostCommentsSchema } from '../schemas/post.schema.js'
import { postIdParamSchema, commentIdParamSchema, paginationSchema } from '../schemas/common.schema.js'

const router = express.Router()

router.post('/posts/:postId/comments', authenticate, validate(postIdParamSchema, 'params'), validate(createCommentSchema), createComment)
router.get('/posts/:postId/comments', authenticate, validate(postIdParamSchema, 'params'), validate(paginationSchema, 'query'), getPostComments)
router.get('/comments/:commentId/replies', authenticate, validate(commentIdParamSchema, 'params'), validate(paginationSchema, 'query'), getCommentReplies)
router.put('/comments/:commentId', authenticate, validate(commentIdParamSchema, 'params'), validate(editCommentSchema), updateComment)
router.delete('/comments/:commentId', authenticate, validate(commentIdParamSchema, 'params'), validate(deleteCommentSchema), deleteComment)

export default router
