import express from 'express'
import { uploadMedia } from '../controllers/uploadController.js'
import authenticate from '../middleware/authenticate.js'
import { validate } from '../middleware/validation.middleware.js'
import { uploadMediaSchema } from '../schemas/upload.schema.js'

const router = express.Router()

router.post('/media', authenticate, validate(uploadMediaSchema), uploadMedia)

export default router
