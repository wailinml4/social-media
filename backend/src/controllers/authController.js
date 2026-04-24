import { signupService, loginService, checkAuthService, verifyEmailService, resendVerificationEmailService, forgotPasswordService, resetPasswordService } from "../services/authService.js"
import setCookie from "../utils/setCookie.js"

export const signup = async (req, res, next) => {
    try {
        const { fullName, email, password, confirmPassword } = req.body
        const { user, token } = await signupService({ fullName, email, password, confirmPassword })
        setCookie(res, token)

        return res.status(201).json({
            success: true,
            message: "Signup successful",
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

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const { user, token } = await loginService({ email, password })
        setCookie(res, token)

        return res.status(200).json({
            success: true,
            message: "Login successful",
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

export const checkAuth = async (req, res, next) => {
    try {
        const { userId } = req.user
        const user = await checkAuthService(userId)

        return res.status(200).json({
            success: true,
            message: "Authentication successful",
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

export const logout = (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "Strict",
            secure: (process.env.NODE_ENV || "development") !== "development",
            maxAge: 0,
        })

        return res.status(200).json({ success: true, message: "Logout successful" })
    } catch (error) {
        next(error)
    }
}

export const verifyEmail = async (req, res, next) => {
    try {
        const { verificationCode } = req.body
        const user = await verifyEmailService(verificationCode)

        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
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

export const resendVerificationEmail = async (req, res, next) => {
    try {
        const { email } = req.body
        const user = await resendVerificationEmailService(email)

        return res.status(200).json({
            success: true,
            message: "Verification email resent successfully",
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

export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body
        await forgotPasswordService(email)

        return res.status(200).json({ success: true, message: "Password reset link sent to your email" })
    } catch (error) {
        next(error)
    }
}

export const resetPassword = async (req, res, next) => {
    try {
        const { resetPasswordToken } = req.params
        const { password } = req.body
        await resetPasswordService(resetPasswordToken, password)

        return res.status(200).json({ success: true, message: "Password reset successfully" })
    } catch (error) {
        next(error)
    }
}
