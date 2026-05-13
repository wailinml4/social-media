import { z } from 'zod'
import { nonEmptyString } from './common.schema.js'

const mediaItemSchema = z.object({
  url: z.string().url('Invalid media URL'),
  type: z.string().min(1, 'Media type is required'),
  altText: z.string().max(200).optional(),
})

export const createPostSchema = z
  .object({
    description: z
      .string()
      .max(2000, 'Post content must be less than 2000 characters')
      .optional(),
    media: z.array(mediaItemSchema).max(10, 'Maximum 10 media files allowed').optional(),
    images: z.array(z.string().url('Invalid image URL')).max(10, 'Maximum 10 images allowed').optional(),
    tags: z.array(z.string().max(50, 'Tag must be less than 50 characters')).max(10, 'Maximum 10 tags allowed').optional(),
    location: z.string().max(100, 'Location must be less than 100 characters').optional(),
    isPrivate: z.boolean().default(false),
  })
  .refine(
    (data) =>
      (data.description && data.description.trim().length > 0) ||
      (data.media && data.media.length > 0) ||
      (data.images && data.images.length > 0),
    { message: 'Post must have content or media' },
  )

export const editPostSchema = z.object({
  description: z
    .string()
    .max(2000, 'Post content must be less than 2000 characters')
    .optional(),
  media: z.array(mediaItemSchema).max(10, 'Maximum 10 media files allowed').optional(),
  images: z.array(z.string().url('Invalid image URL')).max(10, 'Maximum 10 images allowed').optional(),
  tags: z.array(z.string().max(50, 'Tag must be less than 50 characters')).max(10, 'Maximum 10 tags allowed').optional(),
  location: z.string().max(100, 'Location must be less than 100 characters').optional(),
  isPrivate: z.boolean().default(false),
})

export const deletePostSchema = z.object({})

export const createCommentSchema = z.object({
  content: nonEmptyString('Comment').max(500, 'Comment must be less than 500 characters'),
  parentId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid parent comment ID')
    .nullable()
    .optional(),
})

export const editCommentSchema = z.object({
  content: nonEmptyString('Comment').max(500, 'Comment must be less than 500 characters'),
})

export const deleteCommentSchema = z.object({})

export const likePostSchema = z.object({})

export const unlikePostSchema = z.object({})

export const likeCommentSchema = z.object({})

export const unlikeCommentSchema = z.object({})

export const getPostsSchema = z.object({
  page: z.string().regex(/^\d+$/, 'Page must be a number').transform(Number).default(1),
  limit: z.string().regex(/^\d+$/, 'Limit must be a number').transform(Number).default(10),
  userId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID')
    .optional(),
})

export const searchPostsSchema = z.object({
  query: nonEmptyString('Search query').max(100, 'Search query must be less than 100 characters'),
  page: z.string().regex(/^\d+$/, 'Page must be a number').transform(Number).default(1),
  limit: z.string().regex(/^\d+$/, 'Limit must be a number').transform(Number).default(10),
})

export const getPostCommentsSchema = z.object({
  postId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid post ID'),
  page: z.string().regex(/^\d+$/, 'Page must be a number').transform(Number).default(1),
  limit: z.string().regex(/^\d+$/, 'Limit must be a number').transform(Number).default(10),
})

// Type exports
export type CreatePostInput = z.infer<typeof createPostSchema>
export type EditPostInput = z.infer<typeof editPostSchema>
export type DeletePostInput = z.infer<typeof deletePostSchema>
export type CreateCommentInput = z.infer<typeof createCommentSchema>
export type EditCommentInput = z.infer<typeof editCommentSchema>
export type DeleteCommentInput = z.infer<typeof deleteCommentSchema>
export type LikePostInput = z.infer<typeof likePostSchema>
export type UnlikePostInput = z.infer<typeof unlikePostSchema>
export type LikeCommentInput = z.infer<typeof likeCommentSchema>
export type UnlikeCommentInput = z.infer<typeof unlikeCommentSchema>
export type GetPostsInput = z.infer<typeof getPostsSchema>
export type SearchPostsInput = z.infer<typeof searchPostsSchema>
export type GetPostCommentsInput = z.infer<typeof getPostCommentsSchema>
