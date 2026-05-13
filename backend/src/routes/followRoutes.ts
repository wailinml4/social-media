import express from 'express'
import { followUser, unfollowUser, getFollowers, getFollowees, checkFollowStatus, getFriends } from '../controllers/followController.js'
import authenticate from '../middleware/authenticate.js'
import { validate } from '../middleware/validation.middleware.js'
import { followUserSchema, unfollowUserSchema } from '../schemas/user.schema.js'
import { userIdParamSchema } from '../schemas/common.schema.js'

const router = express.Router()

router.post('/:userId/follow', authenticate, validate(userIdParamSchema, 'params'), followUser)
router.delete('/:userId/follow', authenticate, validate(userIdParamSchema, 'params'), unfollowUser)
router.get('/:userId/followers', authenticate, validate(userIdParamSchema, 'params'), getFollowers)
router.get('/:userId/following', authenticate, validate(userIdParamSchema, 'params'), getFollowees)
router.get('/:userId/follow-status', authenticate, validate(userIdParamSchema, 'params'), checkFollowStatus)
router.get('/:userId/friends', authenticate, validate(userIdParamSchema, 'params'), getFriends)

export default router
