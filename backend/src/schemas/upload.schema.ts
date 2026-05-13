import { z } from 'zod'

export const uploadMediaSchema = z.object({
  image: z.string().min(1, 'Image/base64 string is required'),
})

export type UploadMediaInput = z.infer<typeof uploadMediaSchema>
