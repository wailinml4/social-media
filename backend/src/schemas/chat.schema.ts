import { z } from 'zod'
import { imageSchema, videoSchema } from './common.schema.js'

export const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required').max(1000, 'Message must be less than 1000 characters'),
  media: z.union([imageSchema(5), videoSchema(25)]).optional(),
  replyToId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid message ID to reply to')
    .nullable()
    .optional(),
})

export const createConversationSchema = z.object({
  participants: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid participant ID')).min(1, 'At least one participant is required'),
})

export const getConversationsSchema = z.object({
  page: z.string().regex(/^\d+$/, 'Page must be a number').transform(Number).default(1),
  limit: z.string().regex(/^\d+$/, 'Limit must be a number').transform(Number).default(20),
})

export const getMessagesSchema = z.object({
  page: z.string().regex(/^\d+$/, 'Page must be a number').transform(Number).default(1),
  limit: z.string().regex(/^\d+$/, 'Limit must be a number').transform(Number).default(20),
})

export const deleteMessageSchema = z.object({})

export const editMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required').max(1000, 'Message must be less than 1000 characters'),
})

export const markMessagesAsReadSchema = z.object({
  messageIds: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid message ID')).optional(),
})

// Stories
const storySlideSchema = z.object({
  mediaUrl: z.string().url('Invalid media URL'),
  type: z.enum(['image', 'video']).default('image'),
  caption: z.string().max(200, 'Caption must be less than 200 characters').optional(),
  duration: z.number().int().min(1).max(60000).default(5000),
  timestamp: z.string().optional(),
})

export const createStorySchema = z.object({
  slides: z.array(storySlideSchema).min(1, 'At least one slide is required').max(10, 'Maximum 10 slides allowed'),
  isPrivate: z.boolean().default(false),
  allowComments: z.boolean().default(true),
  allowReactions: z.boolean().default(true),
})

export const viewStorySchema = z.object({})

export const reactToStorySchema = z.object({
  reaction: z.enum(['❤️', '😂', '😮', '😢', '😡', '👍', '👎']),
})

export const replyToStorySchema = z.object({
  content: z.string().min(1, 'Reply content is required').max(200, 'Reply must be less than 200 characters'),
})

export const deleteStorySchema = z.object({})

export const getStoriesSchema = z.object({
  userId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID')
    .optional(),
  page: z.string().regex(/^\d+$/, 'Page must be a number').transform(Number).default(1),
  limit: z.string().regex(/^\d+$/, 'Limit must be a number').transform(Number).default(20),
})

export const getMyStoriesSchema = z.object({
  page: z.string().regex(/^\d+$/, 'Page must be a number').transform(Number).default(1),
  limit: z.string().regex(/^\d+$/, 'Limit must be a number').transform(Number).default(20),
})

// Type exports
export type SendMessageInput = z.infer<typeof sendMessageSchema>
export type CreateConversationInput = z.infer<typeof createConversationSchema>
export type GetConversationsInput = z.infer<typeof getConversationsSchema>
export type GetMessagesInput = z.infer<typeof getMessagesSchema>
export type DeleteMessageInput = z.infer<typeof deleteMessageSchema>
export type EditMessageInput = z.infer<typeof editMessageSchema>
export type MarkMessagesAsReadInput = z.infer<typeof markMessagesAsReadSchema>
export type CreateStoryInput = z.infer<typeof createStorySchema>
export type ViewStoryInput = z.infer<typeof viewStorySchema>
export type ReactToStoryInput = z.infer<typeof reactToStorySchema>
export type ReplyToStoryInput = z.infer<typeof replyToStorySchema>
export type DeleteStoryInput = z.infer<typeof deleteStorySchema>
export type GetStoriesInput = z.infer<typeof getStoriesSchema>
export type GetMyStoriesInput = z.infer<typeof getMyStoriesSchema>
