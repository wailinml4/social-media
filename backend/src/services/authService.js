import bcrypt from "bcrypt"
import User from "../models/User.js"
import transporter from "../config/nodemailer.js"
import crypto from "crypto"
import generateVerificationCode from "../utils/generateVerificationCode.js"
import generateToken from "../utils/generateToken.js"
import { VERIFICATION_CODE_EXPIRY_MS, RESET_PASSWORD_EXPIRY_MS, PASSWORD_MIN_LENGTH, BCRYPT_SALT_ROUNDS } from "../constants/index.js"

export const signupService = async ({ fullName, email, password, confirmPassword }) => {
    if (!fullName || !email || !password || !confirmPassword) {
        const error = new Error("All fields are required")
        error.statusCode = 400
        throw error
    }

    const existingEmail = await User.findOne({ email })
    if (existingEmail) {
        const error = new Error("Email already exists")
        error.statusCode = 400
        throw error
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        const error = new Error("Invalid email address")
        error.statusCode = 400
        throw error
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
        const error = new Error(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
        error.statusCode = 400
        throw error
    }

    if (password !== confirmPassword) {
        const error = new Error("Passwords do not match")
        error.statusCode = 400
        throw error
    }

    const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS)
    const hashedPassword = await bcrypt.hash(password, salt)

    const verificationCode = generateVerificationCode()
    const verificationCodeExpiresAt = Date.now() + VERIFICATION_CODE_EXPIRY_MS

    const user = await User.create({
        fullName,
        email,
        password: hashedPassword,

        verificationCode,
        verificationCodeExpiresAt,
    })

    await transporter.sendMail({
        to: user.email,
        subject: "Email Verification Code",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Your Verification Code</h2>
                <p>Hello ${user.fullName || "there"},</p>
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

export const loginService = async ({ email, password }) => {
    if (!email || !password) {
        const error = new Error("All fields are required")
        error.statusCode = 400
        throw error
    }

    const user = await User.findOne({ email })
    if (!user) {
        const error = new Error("Invalid credentials")
        error.statusCode = 400
        throw error
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
        const error = new Error("Invalid credentials")
        error.statusCode = 400
        throw error
    }

    const token = generateToken(user)
    return { user, token }
}

export const checkAuthService = async userId => {
    const user = await User.findById(userId)
    if (!user) {
        const error = new Error("User not found")
        error.statusCode = 404
        throw error
    }
    return user
}

export const verifyEmailService = async verificationCode => {
    const user = await User.findOne({
        verificationCode: verificationCode,
        verificationCodeExpiresAt: { $gt: Date.now() },
    })
    if (!user) {
        const error = new Error("Invalid or expired verification code")
        error.statusCode = 400
        throw error
    }

    user.isVerified = true
    user.verificationCode = undefined
    user.verificationCodeExpiresAt = undefined
    await user.save()

    await transporter.sendMail({
        to: user.email,
        subject: "Welcome to Our Platform!",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #2d3748;">Welcome to Our Platform, ${user.fullName || "Valued User"}! 👋</h2>
                <p>Thank you for verifying your email address. Your account is now fully activated and ready to use!</p>
                
                <div style="margin: 25px 0;">
                    <p>Here's what you can do next:</p>
                    <ul style="padding-left: 20px;">
                        <li>Complete your profile</li>
                        <li>Explore our features</li>
                        <li>Get started with your first project</li>
                    </ul>
                </div>

                <div style="margin: 30px 0; text-align: center;">
                    <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}" 
                       style="display: inline-block; padding: 12px 24px; background-color: #4299e1; 
                              color: white; text-decoration: none; border-radius: 4px; 
                              font-weight: 500;">
                        Get Started
                    </a>
                </div>

                <p>If you have any questions, feel free to reply to this email.</p>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #718096; font-size: 14px;">
                    <p>Best regards,<br/>The ${process.env.APP_NAME || "Our Team"}</p>
                </div>
            </div>
        `,
    })

    return user
}

export const resendVerificationEmailService = async email => {
    const user = await User.findOne({ email })
    if (!user) {
        const error = new Error("User not found")
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
        subject: "Email Verification Code",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Your Verification Code</h2>
                <p>Hello ${user.fullName || "there"},</p>
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

    return user
}

export const forgotPasswordService = async email => {
    const user = await User.findOne({ email })
    if (!user) {
        const error = new Error("Email does not exist")
        error.statusCode = 404
        throw error
    }

    const resetPasswordToken = crypto.randomBytes(20).toString("hex")
    const resetPasswordTokenExpiresAt = Date.now() + RESET_PASSWORD_EXPIRY_MS

    user.resetPasswordToken = resetPasswordToken
    user.resetPasswordTokenExpiresAt = resetPasswordTokenExpiresAt
    await user.save()

    const resetPasswordUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetPasswordToken}`

    await transporter.sendMail({
        to: user.email,
        subject: "Password Reset Request",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Password Reset Request</h2>
                <p>Hello ${user.fullName || "there"},</p>
                <p>You requested a password reset. Click the link below to set a new password:</p>
                <a href="${resetPasswordUrl}" 
                   style="display: inline-block; padding: 10px 20px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0;">
                    Reset Password
                </a>
                <p>Or copy and paste this link into your browser:</p>
                <p>${resetPasswordUrl}</p>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
                <br/>
                <p>Best regards,<br/>The Team</p>
            </div>
        `,
    })
}

export const resetPasswordService = async (resetPasswordToken, password) => {
    const user = await User.findOne({
        resetPasswordToken: resetPasswordToken,
        resetPasswordTokenExpiresAt: { $gt: Date.now() },
    })
    if (!user) {
        const error = new Error("Invalid or expired password reset token")
        error.statusCode = 400
        throw error
    }

    if (!password) {
        const error = new Error("Password is required")
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
        subject: "Password Reset Successful",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Password Reset Successful</h2>
                <p>Hello ${user.fullName || "there"},</p>
                <p>Your password has been successfully reset.</p>
                <p>If you didn't make this change, please contact us immediately.</p>
                <br/>
                <p>Best regards,<br/>The Team</p>
            </div>
        `,
    })
}
