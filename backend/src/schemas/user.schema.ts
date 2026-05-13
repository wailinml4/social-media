import { z } from 'zod'
import { nonEmptyString, usernameSchema, bioSchema } from './common.schema.js'

export const editProfileSchema = z.object({
  fullName: nonEmptyString('Full name').max(100, 'Full name must be less than 100 characters'),
  username: usernameSchema().optional(),
  bio: bioSchema(),
  location: z.string().max(100, 'Location must be less than 100 characters').optional(),
  profilePicture: z.string().optional().or(z.literal('')),
  coverPicture: z.string().optional().or(z.literal('')),
})

export const followUserSchema = z.object({})

export const unfollowUserSchema = z.object({})

export const searchUsersSchema = z.object({
  query: nonEmptyString('Search query').max(50, 'Search query must be less than 50 characters'),
  page: z.string().regex(/^\d+$/, 'Page must be a number').transform(Number).default(1),
  limit: z.string().regex(/^\d+$/, 'Limit must be a number').transform(Number).default(10),
})

export const updateProfileVisibilitySchema = z.object({
  isPrivate: z.boolean(),
})

export const blockUserSchema = z.object({})

export const unblockUserSchema = z.object({})

// Type exports
export type EditProfileInput = z.infer<typeof editProfileSchema>
export type FollowUserInput = z.infer<typeof followUserSchema>
export type UnfollowUserInput = z.infer<typeof unfollowUserSchema>
export type SearchUsersInput = z.infer<typeof searchUsersSchema>
export type UpdateProfileVisibilityInput = z.infer<typeof updateProfileVisibilitySchema>
export type BlockUserInput = z.infer<typeof blockUserSchema>
export type UnblockUserInput = z.infer<typeof unblockUserSchema>
