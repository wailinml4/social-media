import axiosInstance from "../config/api.js"

export const signupService = async (fullName, email, password, confirmPassword) => {
	const response = await axiosInstance.post("/auth/signup", { fullName, email, password, confirmPassword })
	return response.data.data
}

export const loginService = async (email, password) => {
	const response = await axiosInstance.post("/auth/login", { email, password })
	return response.data.data
}

export const checkAuthService = async () => {
	const response = await axiosInstance.get("/auth/check-auth")
	return response.data.data
}

export const logoutService = async () => {
	const response = await axiosInstance.post("/auth/logout")
	return response.data.data
}

export const verifyEmailService = async verificationCode => {
	const response = await axiosInstance.post("/auth/verify-email", { verificationCode })
	return response.data.data
}

export const resendVerificationEmailService = async email => {
	const response = await axiosInstance.post("/auth/resend-verification-email", { email })
	return response.data.data
}

export const forgotPasswordService = async email => {
	const response = await axiosInstance.post("/auth/forgot-password", { email })
	return response.data.data
}

export const resetPasswordService = async (resetPasswordToken, password) => {
	const response = await axiosInstance.post(`/auth/reset-password/${resetPasswordToken}`, { password })
	return response.data.data
}
