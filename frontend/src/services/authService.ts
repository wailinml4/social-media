import axiosInstance from '../config/api.js'
import type { User } from '../types'

export const signupService = async (
  fullName: string,
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
): Promise<User> => {
  const response = await axiosInstance.post('/auth/signup', {
    fullName,
    username,
    email,
    password,
    confirmPassword,
  })
  return response.data.data
}

export const loginService = async (email: string, password: string): Promise<User> => {
  const response = await axiosInstance.post('/auth/login', { email, password })
  return response.data.data
}

export const checkAuthService = async (): Promise<User> => {
  const response = await axiosInstance.get('/auth/check-auth')
  return response.data.data
}

export const logoutService = async (): Promise<void> => {
  const response = await axiosInstance.post('/auth/logout')
  return response.data.data
}

export const verifyEmailService = async (verificationCode: string): Promise<User> => {
  const response = await axiosInstance.post('/auth/verify-email', { verificationCode })
  return response.data.data
}

export const resendVerificationEmailService = async (email: string): Promise<void> => {
  const response = await axiosInstance.post('/auth/resend-verification-email', { email })
  return response.data.data
}

export const forgotPasswordService = async (email: string): Promise<void> => {
  const response = await axiosInstance.post('/auth/forgot-password', { email })
  return response.data.data
}

export const resetPasswordService = async (resetPasswordToken: string, password: string): Promise<void> => {
  const response = await axiosInstance.post(`/auth/reset-password/${resetPasswordToken}`, {
    password,
  })
  return response.data.data
}
