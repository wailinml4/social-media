import type { Request, Response, NextFunction } from 'express'
import {
  signupService,
  loginService,
  checkAuthService,
  verifyEmailService,
  resendVerificationEmailService,
  forgotPasswordService,
  resetPasswordService,
} from '../services/authService.js'
import setCookie from '../utils/setCookie.js'
import env from '../config/env.js'

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fullName, username, email, password, confirmPassword } = req.body
    const { user, token } = await signupService({ fullName, username, email, password, confirmPassword })
    setCookie(res, token)

    return res.status(201).json({
      success: true,
      message: 'Signup successful',
      data: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        bio: user.bio || '',
        email: user.email,
        isVerified: user.isVerified,
        profilePicture: user.profilePicture || '',
        coverPicture: user.coverPicture || '',
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body
    const { user, token } = await loginService({ email, password })
    setCookie(res, token)

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        bio: user.bio || '',
        email: user.email,
        isVerified: user.isVerified,
        profilePicture: user.profilePicture || '',
        coverPicture: user.coverPicture || '',
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user!
    const user = await checkAuthService({ userId })

    return res.status(200).json({
      success: true,
      message: 'Authentication successful',
      data: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        bio: user.bio || '',
        email: user.email,
        isVerified: user.isVerified,
        profilePicture: user.profilePicture || '',
        coverPicture: user.coverPicture || '',
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('token', {
      secure: env.NODE_ENV === 'production',
      sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      maxAge: 0,
    })

    return res.status(200).json({ success: true, message: 'Logout successful', data: null })
  } catch (error) {
    next(error)
  }
}

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { verificationCode } = req.body
    const user = await verifyEmailService({ verificationCode })

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      data: {
        userId: user.id,
        fullName: user.fullName,
        email: user.email,
        isVerified: user.isVerified,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const resendVerificationEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body
    const user = await resendVerificationEmailService({ email })

    return res.status(200).json({
      success: true,
      message: 'Verification email resent successfully',
      data: {
        userId: user.id,
        fullName: user.fullName,
        email: user.email,
        isVerified: user.isVerified,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body
    await forgotPasswordService({ email })

    return res.status(200).json({ success: true, message: 'Password reset link sent to your email', data: null })
  } catch (error) {
    next(error)
  }
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resetPasswordToken = String(req.params.resetPasswordToken)
    const { password } = req.body
    await resetPasswordService({ resetPasswordToken, password })

    return res.status(200).json({ success: true, message: 'Password reset successfully', data: null })
  } catch (error) {
    next(error)
  }
}
