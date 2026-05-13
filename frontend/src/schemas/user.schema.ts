import { z } from 'zod'
import { nonEmptyString, usernameSchema, bioSchema } from './common.schema'

export const editProfileSchema = z
  .object({
    fullName: nonEmptyString('Full name').max(100, 'Full name must be less than 100 characters'),
    username: usernameSchema().optional(),
    bio: bioSchema(),
    location: z.string().max(100, 'Location must be less than 100 characters').optional(),
    avatar: z.string().optional().or(z.literal('')),
    coverPicture: z.string().optional().or(z.literal('')),
  })
  .strict()

export const followUserSchema = z
  .object({
    userId: z.string().uuid('Invalid user ID'),
  })
  .strict()

export const unfollowUserSchema = z
  .object({
    userId: z.string().uuid('Invalid user ID'),
  })
  .strict()

export const searchUsersSchema = z
  .object({
    query: nonEmptyString('Search query').max(50, 'Search query must be less than 50 characters'),
    limit: z.number().int().min(1).max(50).default(10),
    offset: z.number().int().min(0).default(0),
  })
  .strict()

// Type exports
export type EditProfileInput = z.infer<typeof editProfileSchema>
export type FollowUserInput = z.infer<typeof followUserSchema>
export type UnfollowUserInput = z.infer<typeof unfollowUserSchema>
export type SearchUsersInput = z.infer<typeof searchUsersSchema>
