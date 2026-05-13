import type { Response, NextFunction, Request } from 'express'
import jwt from 'jsonwebtoken'
import env from '../config/env.js'

const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token } = req.cookies
    if (!token) {
      res.status(401).json({ success: false, message: 'Unauthorized -- no token provided' })
      return
    }

    const secret = env.JWT_SECRET
    if (!secret) {
      res.status(500).json({ success: false, message: 'Server misconfiguration' })
      return
    }

    const decoded = jwt.verify(token, secret)
    if (typeof decoded === 'string' || !('userId' in decoded) || typeof decoded.userId !== 'string') {
      res.status(401).json({ success: false, message: 'Unauthorized -- invalid or expired token' })
      return
    }

    req.user = { ...decoded, userId: decoded.userId }
    next()
  } catch (error) {
    next(error)
  }
}

export default authenticate
