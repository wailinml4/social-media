import rateLimit from 'express-rate-limit'

// Temporarily disable rate limiting during development or when explicitly requested.
const DISABLE_RATE_LIMITING =
  process.env.DISABLE_RATE_LIMITING === 'true' || process.env.NODE_ENV === 'development'

export const generalLimiter = DISABLE_RATE_LIMITING
  ? (req, res, next) => next()
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
