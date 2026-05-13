import { z } from 'zod'

export const createNotificationSchema = z.object({
  recipientId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user id'),
  type: z.string().min(1),
  postId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid post id').optional(),
  commentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid comment id').optional(),
})

export type CreateNotification = z.infer<typeof createNotificationSchema>
