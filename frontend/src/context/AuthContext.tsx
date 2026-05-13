/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types'
import {
  signupService,
  loginService,
  checkAuthService,
  logoutService,
  verifyEmailService,
  resendVerificationEmailService,
  forgotPasswordService,
  resetPasswordService,
} from '../services/authService.js'

interface AuthContextValue {
  user: User | null
  setUser: (user: User | null) => void
  isAuthenticated: boolean
  isCheckingAuth: boolean
  isSigningUp: boolean
  isLoggingIn: boolean
  isLoggingOut: boolean
  isVerifyingEmail: boolean
  isResendingVerificationEmail: boolean
  isSendingForgotPassword: boolean
  isResettingPassword: boolean
  error: string | null
  signup: (fullName: string, username: string, email: string, password: string, confirmPassword: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  verifyEmail: (verificationCode: string) => Promise<void>
  resendVerificationEmail: (email: string) => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (resetPasswordToken: string, password: string) => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false)
  const [isResendingVerificationEmail, setIsResendingVerificationEmail] = useState(false)
  const [isSendingForgotPassword, setIsSendingForgotPassword] = useState(false)
  const [isResettingPassword, setIsResettingPassword] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const isAuthenticated = !!user

  const signup = async (fullName: string, username: string, email: string, password: string, confirmPassword: string) => {
    try {
      setIsSigningUp(true)
      const response = await signupService(fullName, username, email, password, confirmPassword)
      setUser(response)
      setAuthError(null)
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Signup failed')
      throw err
    } finally {
      setIsSigningUp(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoggingIn(true)
      const response = await loginService(email, password)
      setUser(response)
      setAuthError(null)
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Login failed')
      throw err
    } finally {
      setIsLoggingIn(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoggingOut(true)
      await logoutService()
      setUser(null)
      setAuthError(null)
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Logout failed')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const checkAuth = async () => {
    try {
      setIsCheckingAuth(true)
      const response = await checkAuthService()
      setUser(response)
      setAuthError(null)
    } catch (err) {
      void err
      setUser(null)
    } finally {
      setIsCheckingAuth(false)
    }
  }

  const verifyEmail = async (verificationCode: string) => {
    try {
      setIsVerifyingEmail(true)
      const response = await verifyEmailService(verificationCode)
      setUser(response)
      setAuthError(null)
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Verification failed')
      throw err
    } finally {
      setIsVerifyingEmail(false)
    }
  }

  const resendVerificationEmail = async (email: string) => {
    try {
      setIsResendingVerificationEmail(true)
      await resendVerificationEmailService(email)
      setAuthError(null)
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Resend failed')
      throw err
    } finally {
      setIsResendingVerificationEmail(false)
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      setIsSendingForgotPassword(true)
      await forgotPasswordService(email)
      setAuthError(null)
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Failed to send reset email')
      throw err
    } finally {
      setIsSendingForgotPassword(false)
    }
  }

  const resetPassword = async (resetPasswordToken: string, password: string) => {
    try {
      setIsResettingPassword(true)
      await resetPasswordService(resetPasswordToken, password)
      setAuthError(null)
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Password reset failed')
      throw err
    } finally {
      setIsResettingPassword(false)
    }
  }

  useEffect(() => {
    setTimeout(() => {
      void checkAuth()
    }, 0)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        isCheckingAuth,
        isSigningUp,
        isLoggingIn,
        isLoggingOut,
        isVerifyingEmail,
        isResendingVerificationEmail,
        isSendingForgotPassword,
        isResettingPassword,
        error: authError,
        signup,
        login,
        logout,
        verifyEmail,
        resendVerificationEmail,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
