import express from 'express'
import type { Request, Response, NextFunction } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'

import connectDB from './config/db.js'
import { generalLimiter } from './middleware/generalLimiter.js'
import authRoutes from './routes/authRoutes.js'
import postRoutes from './routes/postRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import userRoutes from './routes/userRoutes.js'
import followRoutes from './routes/followRoutes.js'
import likeRoutes from './routes/likeRoutes.js'
import bookmarkRoutes from './routes/bookmarkRoutes.js'
import commentRoutes from './routes/commentRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import conversationRoutes from './routes/conversationRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import storyRoutes from './routes/storyRoutes.js'
import errorHandler from './middleware/errorHandler.js'
import env from './config/env.js'

const app = express()

const __dirname = path.resolve()

app.use(helmet())
if (env.NODE_ENV === 'production') {
  app.use(
    cors({
      origin: [env.FRONTEND_URL, /\.vercel\.app$/],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    }),
  )
} else {
  app.use(
    cors({
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    }),
  )
}

app.use(morgan('dev'))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cookieParser())

// Global rate limiter for general API endpoints
app.use(generalLimiter)

app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/stories', storyRoutes)
app.use('/api/users', userRoutes)
app.use('/api/follow', followRoutes)
app.use('/api', likeRoutes)
app.use('/api', bookmarkRoutes)
app.use('/api', commentRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/conversations', conversationRoutes)
app.use('/api/messages', messageRoutes)

app.get('/', (_req: Request, res: Response): void => {
  res.send('Hello World!')
})

app.use(errorHandler)

if (env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/dist')))

  app.get('(.*)', (_req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  })
}

export default app
