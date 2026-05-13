import bcrypt from 'bcrypt'
import User from '../models/User.js'
import transporter from '../config/nodemailer.js'
import crypto from 'crypto'
import generateVerificationCode from '../utils/generateVerificationCode.js'
import generateToken from '../utils/generateToken.js'
import generateVerificationEmail from '../utils/generateVerificationEmail.js'
import generateResetPasswordEmail from '../utils/generateResetPasswordEmail.js'
import { VERIFICATION_CODE_EXPIRY_MS, RESET_PASSWORD_EXPIRY_MS, PASSWORD_MIN_LENGTH, BCRYPT_SALT_ROUNDS } from '../constants/index.js'
import env from '../config/env.js'

export const signupService = async ({
  fullName,
  username,
  email,
  password,
  confirmPassword,
}: {
  fullName: string
  username: string
  email: string
  password: string
  confirmPassword: string
}) => {
  if (!fullName || !username || !email || !password || !confirmPassword) {
    const error = new Error('All fields are required')
    error.statusCode = 400
    throw error
  }

  const existingEmail = await User.findOne({ email })
  if (existingEmail) {
    const error = new Error('Email already exists')
    error.statusCode = 400
    throw error
  }

  const existingUsername = await User.findOne({ username: username.toLowerCase() })
  if (existingUsername) {
    const error = new Error('Username already taken')
    error.statusCode = 400
    throw error
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    const error = new Error('Invalid email address')
    error.statusCode = 400
    throw error
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    const error = new Error(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
    error.statusCode = 400
    throw error
  }

  if (password !== confirmPassword) {
    const error = new Error('Passwords do not match')
    error.statusCode = 400
    throw error
  }

  const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS)
  const hashedPassword = await bcrypt.hash(password, salt)

  const verificationCode = generateVerificationCode()
  const verificationCodeExpiresAt = Date.now() + VERIFICATION_CODE_EXPIRY_MS

  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    email,
    password: hashedPassword,

    verificationCode,
    verificationCodeExpiresAt,
  })

  await transporter.sendMail({
    to: user.email,
    subject: 'Email Verification Code',
    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Your Verification Code</h2>
                <p>Hello ${user.fullName || 'there'},</p>
                <p>Please use the following code to verify your email address:</p>
                <h3 style="background: #f4f4f4; padding: 10px; display: inline-block; border-radius: 5px;">
                    ${verificationCode}
                </h3>
                <p>This code will expire in 24 hours.</p>
                <p>If you didn't request this code, please ignore this email.</p>
                <br/>
                <p>Best regards,<br/>The Team</p>
            </div>
        `,
  })

  const token = generateToken(user)
  return { user, token }
}

export const loginService = async ({ email, password }: { email: string; password: string }) => {
  if (!email || !password) {
    const error = new Error('All fields are required')
    error.statusCode = 400
    throw error
  }

  const user = await User.findOne({ email })
  if (!user) {
    const error = new Error('Invalid credentials')
    error.statusCode = 400
    throw error
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    const error = new Error('Invalid credentials')
    error.statusCode = 400
    throw error
  }

  const token = generateToken(user)
  return { user, token }
}

export const checkAuthService = async ({ userId }: { userId: string }) => {
  const user = await User.findById(userId)
  if (!user) {
    const error = new Error('User not found')
    error.statusCode = 404
    throw error
  }
  return user
}

export const verifyEmailService = async ({ verificationCode }: { verificationCode: string }) => {
  const user = await User.findOne({
    verificationCode: verificationCode,
    verificationCodeExpiresAt: { $gt: Date.now() },
  })
  if (!user) {
    const error = new Error('Invalid or expired verification code')
    error.statusCode = 400
    throw error
  }

  user.isVerified = true
  user.verificationCode = undefined
  user.verificationCodeExpiresAt = undefined
  await user.save()

  await transporter.sendMail({
    to: user.email,
    subject: 'Welcome to Our Platform!',
    html: generateVerificationEmail(user.fullName, 'Email verified successfully'),
  })

  return user
}

export const resendVerificationEmailService = async ({ email }: { email: string }) => {
  const user = await User.findOne({ email })
  if (!user) {
    const error = new Error('User not found')
    error.statusCode = 404
    throw error
  }

  const verificationCode = generateVerificationCode()
  const verificationCodeExpiresAt = Date.now() + VERIFICATION_CODE_EXPIRY_MS

  user.verificationCode = verificationCode
  user.verificationCodeExpiresAt = verificationCodeExpiresAt
  await user.save()

  await transporter.sendMail({
    to: user.email,
    subject: 'Email Verification Code',
    html: generateVerificationEmail(user.fullName, verificationCode),
  })

  return user
}

export const forgotPasswordService = async ({ email }: { email: string }) => {
  const user = await User.findOne({ email })
  if (!user) {
    const error = new Error('Email does not exist')
    error.statusCode = 404
    throw error
  }

  const resetPasswordToken = crypto.randomBytes(20).toString('hex')
  const resetPasswordTokenExpiresAt = Date.now() + RESET_PASSWORD_EXPIRY_MS

  user.resetPasswordToken = resetPasswordToken
  user.resetPasswordTokenExpiresAt = resetPasswordTokenExpiresAt
  await user.save()

  const resetPasswordUrl = `${env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetPasswordToken}`

  await transporter.sendMail({
    to: user.email,
    subject: 'Password Reset Request',
    html: generateResetPasswordEmail(resetPasswordUrl),
  })

  return user
}

export const resetPasswordService = async ({ resetPasswordToken, password }: { resetPasswordToken: string; password: string }) => {
  const user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordTokenExpiresAt: { $gt: Date.now() },
  })
  if (!user) {
    const error = new Error('Invalid or expired password reset token')
    error.statusCode = 400
    throw error
  }

  if (!password) {
    const error = new Error('Password is required')
    error.statusCode = 400
    throw error
  }

  const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS)
  const hashedPassword = await bcrypt.hash(password, salt)

  user.password = hashedPassword
  user.resetPasswordToken = undefined
  user.resetPasswordTokenExpiresAt = undefined
  await user.save()

  await transporter.sendMail({
    to: user.email,
    subject: 'Password Reset Successful',
    html: generateVerificationEmail(user.fullName, 'Password reset successful'),
  })

  return user
}
