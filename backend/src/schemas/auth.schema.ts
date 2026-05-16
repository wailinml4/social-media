import { z } from 'zod'
import { nonEmptyString, emailSchema, passwordSchema } from './common.schema.js'

export const usernameSchema = () =>
  z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers, and underscores')

export const signupSchema = z
  .object({
    fullName: nonEmptyString('Full name').max(100, 'Full name is too long'),
    username: usernameSchema(),
    email: emailSchema(),
    password: passwordSchema(8).regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    ),
    confirmPassword: nonEmptyString('Confirm password'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export const loginSchema = z.object({
  email: emailSchema(),
  password: passwordSchema(1),
})

export const forgotPasswordSchema = z.object({
  email: emailSchema(),
})

export const resetPasswordSchema = z
  .object({
    password: passwordSchema(8).regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    ),
    confirmPassword: nonEmptyString('Confirm password'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export const changePasswordSchema = z
  .object({
    currentPassword: passwordSchema(1),
    newPassword: passwordSchema(8).regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    ),
    confirmNewPassword: nonEmptyString('Confirm new password'),
  })
  .refine(data => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ['confirmNewPassword'],
  })

export const verifyEmailSchema = z.object({
  token: nonEmptyString('Verification token'),
})

// Type exports
export type SignupInput = z.infer<typeof signupSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>
