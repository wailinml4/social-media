import express from "express"
import { signup, login, checkAuth, logout, verifyEmail, resendVerificationEmail, forgotPassword, resetPassword } from "../controllers/authController.js"
import authenticate from "../middleware/authenticate.js"
import { authLimiter } from "../middleware/authLimiter.js"

const router = express.Router()

router.post("/signup", authLimiter, signup)
router.post("/login", authLimiter, login)
router.get("/check-auth", authenticate, checkAuth)
router.post("/logout", logout)
router.post("/verify-email", authLimiter, verifyEmail)
router.post("/resend-verification-email", authLimiter, resendVerificationEmail)
router.post("/forgot-password", authLimiter, forgotPassword)
router.post("/reset-password/:resetPasswordToken", authLimiter, resetPassword)

export default router
