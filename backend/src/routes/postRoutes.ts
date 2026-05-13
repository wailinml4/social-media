import express from 'express'
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getUserPosts,
  getLikedPosts,
  getFollowingPosts,
  getExplorePosts,
  getFriendsPosts,
} from '../controllers/postController.js'
import { getUserBookmarkedPosts } from '../controllers/bookmarkController.js'
import authenticate from '../middleware/authenticate.js'
import { validate } from '../middleware/validation.middleware.js'
import { createPostSchema, editPostSchema, deletePostSchema, getPostsSchema, searchPostsSchema } from '../schemas/post.schema.js'
import { postIdParamSchema, userIdParamSchema } from '../schemas/common.schema.js'

const router = express.Router()

router.post('/', authenticate, validate(createPostSchema), createPost)
router.get('/', authenticate, validate(getPostsSchema, 'query'), getAllPosts)
router.get('/following', authenticate, validate(getPostsSchema, 'query'), getFollowingPosts)
router.get('/explore', authenticate, validate(getPostsSchema, 'query'), getExplorePosts)
router.get('/friends', authenticate, validate(getPostsSchema, 'query'), getFriendsPosts)
router.get('/user/:userId', authenticate, validate(userIdParamSchema, 'params'), validate(getPostsSchema, 'query'), getUserPosts)
router.get('/bookmarked', authenticate, getUserBookmarkedPosts)
router.get('/liked', authenticate, getLikedPosts)

router.get('/:postId', authenticate, validate(postIdParamSchema, 'params'), getPostById)
router.put('/:postId', authenticate, validate(editPostSchema), updatePost)
router.delete('/:postId', authenticate, validate(deletePostSchema), deletePost)

export default router
