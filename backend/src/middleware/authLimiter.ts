import type { Request, Response, NextFunction } from 'express'
import rateLimit from 'express-rate-limit'
import env from '../config/env.js'

// Temporarily disable auth rate limiting during development or when explicitly requested.
const DISABLE_RATE_LIMITING = env.DISABLE_RATE_LIMITING || env.NODE_ENV === 'development'

export const authLimiter = DISABLE_RATE_LIMITING
  ? (req: Request, res: Response, next: NextFunction): void => next()
  : rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes',
      },
      standardHeaders: true,
      legacyHeaders: false,
    })
