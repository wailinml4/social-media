import express from 'express'
import { getCurrentProfile, getProfileById, updateProfile, getSuggestedUsers, searchUsers } from '../controllers/userController.js'
import authenticate from '../middleware/authenticate.js'
import { validate } from '../middleware/validation.middleware.js'
import { editProfileSchema, searchUsersSchema } from '../schemas/user.schema.js'
import { userIdParamSchema } from '../schemas/common.schema.js'

const router = express.Router()

router.get('/me/profile', authenticate, getCurrentProfile)
router.get('/:userId/profile', authenticate, validate(userIdParamSchema, 'params'), getProfileById)
router.put('/me/profile', authenticate, validate(editProfileSchema), updateProfile)
router.get('/suggested', authenticate, getSuggestedUsers)
router.get('/search', authenticate, validate(searchUsersSchema, 'query'), searchUsers)

export default router
