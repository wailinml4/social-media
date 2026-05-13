import { z } from 'zod'
import { nonEmptyString, imageSchema, videoSchema, idParam } from './common.schema'

export const sendMessageSchema = z
  .object({
    conversationId: idParam(),
    content: nonEmptyString('Message').max(1000, 'Message must be less than 1000 characters'),
    media: z.union([imageSchema(5), videoSchema(25)]).optional(),
    replyToId: idParam().optional(),
  })
  .strict()

export const createConversationSchema = z
  .object({
    participantIds: z.array(idParam()).min(1, 'At least one participant is required'),
    initialMessage: nonEmptyString('Message').max(1000, 'Message must be less than 1000 characters'),
  })
  .strict()

export const getConversationsSchema = z
  .object({
    limit: z.number().int().min(1).max(50).default(20),
    offset: z.number().int().min(0).default(0),
  })
  .strict()

export const getMessagesSchema = z
  .object({
    conversationId: idParam(),
    limit: z.number().int().min(1).max(50).default(20),
    offset: z.number().int().min(0).default(0),
  })
  .strict()

export const deleteMessageSchema = z
  .object({
    messageId: idParam(),
  })
  .strict()

export const editMessageSchema = z
  .object({
    messageId: idParam(),
    content: nonEmptyString('Message').max(1000, 'Message must be less than 1000 characters'),
  })
  .strict()

// Stories
export const createStorySchema = z
  .object({
    media: z.union([imageSchema(2), videoSchema(15)]),
    caption: z.string().max(200, 'Caption must be less than 200 characters').optional(),
    duration: z.number().int().min(1).max(60).default(10),
    isPrivate: z.boolean().default(false),
    allowComments: z.boolean().default(true),
    allowReactions: z.boolean().default(true),
  })
  .strict()

export const viewStorySchema = z
  .object({
    storyId: idParam(),
  })
  .strict()

export const reactToStorySchema = z
  .object({
    storyId: idParam(),
    reaction: z.enum(['❤️', '😂', '😮', '😢', '😡', '👍', '👎']),
  })
  .strict()

export const replyToStorySchema = z
  .object({
    storyId: idParam(),
    content: nonEmptyString('Reply').max(200, 'Reply must be less than 200 characters'),
  })
  .strict()

export const deleteStorySchema = z
  .object({
    storyId: idParam(),
  })
  .strict()

export const getStoriesSchema = z
  .object({
    userId: idParam().optional(),
    limit: z.number().int().min(1).max(50).default(20),
    offset: z.number().int().min(0).default(0),
  })
  .strict()

// Type exports
export type SendMessageInput = z.infer<typeof sendMessageSchema>
export type CreateConversationInput = z.infer<typeof createConversationSchema>
export type GetConversationsInput = z.infer<typeof getConversationsSchema>
export type GetMessagesInput = z.infer<typeof getMessagesSchema>
export type DeleteMessageInput = z.infer<typeof deleteMessageSchema>
export type EditMessageInput = z.infer<typeof editMessageSchema>
export type CreateStoryInput = z.infer<typeof createStorySchema>
export type ViewStoryInput = z.infer<typeof viewStorySchema>
export type ReactToStoryInput = z.infer<typeof reactToStorySchema>
export type ReplyToStoryInput = z.infer<typeof replyToStorySchema>
export type DeleteStoryInput = z.infer<typeof deleteStorySchema>
export type GetStoriesInput = z.infer<typeof getStoriesSchema>
