import dotenv from 'dotenv'

dotenv.config()

export const env = {
  PORT: process.env.PORT ?? '3000',
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  BACKEND_URL: process.env.BACKEND_URL ?? 'http://localhost:3000',
  FRONTEND_URL: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  CLOUDINARY_URL: process.env.CLOUDINARY_URL,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  MONGO_URI: process.env.MONGO_URI,
  DISABLE_RATE_LIMITING: process.env.DISABLE_RATE_LIMITING === 'true',
  JWT_SECRET: process.env.JWT_SECRET,
}

export function assertServerEnv(): void {
  const required = ['JWT_SECRET']
  const missing = required.filter(k => !env[k as keyof typeof env])
  if (missing.length) {
    throw new Error(`Missing required server env: ${missing.join(', ')}`)
  }
}

export default env
