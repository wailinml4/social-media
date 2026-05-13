import { z } from 'zod'

export const nonEmptyString = (label = 'Field') => z.string().trim().min(1, `${label} is required`)

export const emailSchema = () => z.string().email('Invalid email address').trim().toLowerCase()

export const passwordSchema = (minLength = 6) => z.string().min(minLength, `Password must be at least ${minLength} characters`)

export const idParam = () => z.string().uuid('Invalid id')

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
