import type { IUser } from '../models/User.js'

// ===== GLOBAL DECLARATIONS =====
declare global {
  type AuthUser = import('jsonwebtoken').JwtPayload & {
    userId: string
  }

  interface Error {
    statusCode?: number
  }
}

// Module augmentations (prefer module augmentation over TS `namespace`)
declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthUser
  }
}

declare module 'socket.io' {
  interface Socket {
    user?: IUser | null
    userId?: string
  }
}

declare module 'nodemailer' {}

// ===== API RESPONSE TYPES =====

export interface ApiResponse<T = null> {
  success: boolean
  message: string
  data: T
}

export interface ApiError {
  success: false
}

// ===== QUERY PARAMETER UTILITIES =====

export interface PaginationQuery {
  page?: string | number | string[]
  limit?: string | number | string[]
}

export interface PostQuery extends PaginationQuery {
  filter?: string | number | string[]
}

export interface SafePaginationParams {
  page: number
  limit: number
}

export function parsePaginationParams(query: PaginationQuery): SafePaginationParams {
  const page = typeof query.page === 'string' ? parseInt(query.page, 10) : typeof query.page === 'number' ? query.page : 1
  const limit = typeof query.limit === 'string' ? parseInt(query.limit, 10) : typeof query.limit === 'number' ? query.limit : 10

  return {
    page: isNaN(page) || page < 1 ? 1 : page,
    limit: isNaN(limit) || limit < 1 || limit > 100 ? 10 : limit,
  }
}
