import { z } from 'zod'

export const uuidParamSchema = z.object({
  id: z.string().uuid('Invalid id'),
})

export const postIdParamSchema = z.object({
  postId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid post id'),
})

export const commentIdParamSchema = z.object({
  commentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid comment id'),
})

export const userIdParamSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user id'),
})

export const conversationIdParamSchema = z.object({
  conversationId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid conversation id'),
})

export const storyIdParamSchema = z.object({
  storyId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid story id'),
})

export const messageIdParamSchema = z.object({
  messageId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid message id'),
})

export const notificationIdParamSchema = z.object({
  notificationId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid notification id'),
})

export const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/, 'Page must be a number').transform(Number).default(1),
  limit: z.string().regex(/^\d+$/, 'Limit must be a number').transform(Number).default(10),
  offset: z.string().regex(/^\d+$/, 'Offset must be a number').transform(Number).optional(),
})

export const searchQuerySchema = z.object({
  query: z.string().trim().min(1, 'Search query is required').max(100, 'Search query too long'),
  ...paginationSchema.shape,
})

export const nonEmptyString = (fieldName = 'Field') => z.string().trim().min(1, `${fieldName} is required`)

export const emailSchema = () => z.string().email('Invalid email address').trim().toLowerCase()

export const passwordSchema = (minLength = 6) => z.string().min(minLength, `Password must be at least ${minLength} characters`)

export const usernameSchema = () =>
  z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')

export const bioSchema = () => z.string().max(500, 'Bio must be less than 500 characters').optional()

export const urlSchema = () => z.string().url('Invalid URL').optional().or(z.literal(''))

export const fileSchema = (maxSizeMB = 5, allowedTypes: string[] = []) =>
  z
    .instanceof(File)
    .refine(file => file.size <= maxSizeMB * 1024 * 1024, `File size must be less than ${maxSizeMB}MB`)
    .refine(file => allowedTypes.length === 0 || allowedTypes.includes(file.type), `File type must be one of: ${allowedTypes.join(', ')}`)

export const imageSchema = (maxSizeMB = 5) => fileSchema(maxSizeMB, ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'])

export const videoSchema = (maxSizeMB = 50) => fileSchema(maxSizeMB, ['video/mp4', 'video/webm', 'video/ogg'])

// Type exports
export type UuidParam = z.infer<typeof uuidParamSchema>
export type PostIdParam = z.infer<typeof postIdParamSchema>
export type CommentIdParam = z.infer<typeof commentIdParamSchema>
export type UserIdParam = z.infer<typeof userIdParamSchema>
export type ConversationIdParam = z.infer<typeof conversationIdParamSchema>
export type StoryIdParam = z.infer<typeof storyIdParamSchema>
export type MessageIdParam = z.infer<typeof messageIdParamSchema>
export type Pagination = z.infer<typeof paginationSchema>
export type SearchQuery = z.infer<typeof searchQuerySchema>
