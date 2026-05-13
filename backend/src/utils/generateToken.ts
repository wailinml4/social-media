import jwt from 'jsonwebtoken'
import env from '../config/env.js'

type TokenUser = {
  id: string
}

const generateToken = (user: TokenUser): string => {
  const secret = env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not configured')
  const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1hr' })
  return token
}

export default generateToken
