import express from 'express'
import {
  signup,
  login,
  checkAuth,
  logout,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js'
import authenticate from '../middleware/authenticate.js'
import { authLimiter } from '../middleware/authLimiter.js'
import { validate } from '../middleware/validation.middleware.js'
import { signupSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, verifyEmailSchema } from '../schemas/auth.schema.js'
import { uuidParamSchema } from '../schemas/common.schema.js'

const router = express.Router()

router.post('/signup', authLimiter, validate(signupSchema), signup)
router.post('/login', authLimiter, validate(loginSchema), login)
router.get('/check-auth', authenticate, checkAuth)
router.post('/logout', logout)
router.post('/verify-email', authLimiter, validate(verifyEmailSchema), verifyEmail)
router.post('/resend-verification-email', authLimiter, resendVerificationEmail)
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword)
router.post('/reset-password/:id', authLimiter, validate(uuidParamSchema, 'params'), validate(resetPasswordSchema), resetPassword)

export default router
