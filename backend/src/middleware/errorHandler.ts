import { Request, Response, NextFunction } from 'express'
import env from '../config/env.js'

const errorHandler = (error: Error & { statusCode?: number }, req: Request, res: Response, _next: NextFunction): void => {
  const statusCode = error.statusCode || 500
  const message = error.message || 'Internal server error'

  console.error(error)

  // Include stack trace in development for debugging
  const response: Record<string, unknown> = {
    success: false,
    message: message,
  }

  if (env.NODE_ENV === 'development') {
    response.stack = error.stack
  }

  res.status(statusCode).json(response)
}

export default errorHandler
