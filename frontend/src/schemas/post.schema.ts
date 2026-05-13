import { z } from 'zod'
import { nonEmptyString, imageSchema, videoSchema, idParam } from './common.schema'

export const createPostSchema = z
  .object({
    content: z.string().min(1, 'Post content is required').max(2000, 'Post content must be less than 2000 characters'),
    media: z
      .array(z.union([imageSchema(10), videoSchema(100)]))
      .max(10, 'Maximum 10 media files allowed')
      .optional(),
    tags: z.array(z.string().max(50, 'Tag must be less than 50 characters')).max(10, 'Maximum 10 tags allowed').optional(),
    location: z.string().max(100, 'Location must be less than 100 characters').optional(),
    isPrivate: z.boolean().default(false),
  })
  .strict()

export const editPostSchema = z
  .object({
    postId: idParam(),
    content: z.string().min(1, 'Post content is required').max(2000, 'Post content must be less than 2000 characters'),
    tags: z.array(z.string().max(50, 'Tag must be less than 50 characters')).max(10, 'Maximum 10 tags allowed').optional(),
    location: z.string().max(100, 'Location must be less than 100 characters').optional(),
    isPrivate: z.boolean().default(false),
  })
  .strict()

export const deletePostSchema = z
  .object({
    postId: idParam(),
  })
  .strict()

export const createCommentSchema = z
  .object({
    postId: idParam(),
    content: nonEmptyString('Comment').max(500, 'Comment must be less than 500 characters'),
    parentId: idParam().optional(),
  })
  .strict()

export const editCommentSchema = z
  .object({
    commentId: idParam(),
    content: nonEmptyString('Comment').max(500, 'Comment must be less than 500 characters'),
  })
  .strict()

export const deleteCommentSchema = z
  .object({
    commentId: idParam(),
  })
  .strict()

export const likePostSchema = z
  .object({
    postId: idParam(),
  })
  .strict()

export const unlikePostSchema = z
  .object({
    postId: idParam(),
  })
  .strict()

export const likeCommentSchema = z
  .object({
    commentId: idParam(),
  })
  .strict()

export const unlikeCommentSchema = z
  .object({
    commentId: idParam(),
  })
  .strict()

export const getPostsSchema = z
  .object({
    limit: z.number().int().min(1).max(50).default(10),
    offset: z.number().int().min(0).default(0),
    userId: idParam().optional(),
  })
  .strict()

export const searchPostsSchema = z
  .object({
    query: nonEmptyString('Search query').max(100, 'Search query must be less than 100 characters'),
    limit: z.number().int().min(1).max(50).default(10),
    offset: z.number().int().min(0).default(0),
  })
  .strict()

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
