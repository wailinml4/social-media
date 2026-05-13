import { NextFunction, Request, Response } from 'express'
import { z, ZodError, ZodType } from 'zod'

export type ValidationSource = 'body' | 'params' | 'query'
type ValidationMode = 'replace' | 'validated'

interface ValidationOptions {
  mode?: ValidationMode
}

declare module 'express-serve-static-core' {
  interface Request {
    validated?: Partial<Record<ValidationSource, z.infer<ZodType>>>
  }
}

export const validate =
  <TSchema extends ZodType>(schema: TSchema, source: ValidationSource = 'body', options: ValidationOptions = {}) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[source])

      if (options.mode === 'validated') {
        req.validated = {
          ...req.validated,
          [source]: parsed,
        }
      } else {
        // Handle query as read-only property
        if (source === 'query') {
          Object.defineProperty(req, 'query', {
            value: parsed,
            writable: true,
            configurable: true,
            enumerable: true,
          })
        } else {
          ;(req as Request & Record<ValidationSource, unknown>)[source] = parsed
        }
      }

      next()
    } catch (error) {
      if (error instanceof ZodError) {
        ;(error as ZodError & { statusCode?: number; source?: ValidationSource }).statusCode = 422
        ;(error as ZodError & { statusCode?: number; source?: ValidationSource }).source = source
      }
      next(error)
    }
  }
