import { Request, Response, NextFunction } from 'express'
import { ZodType } from 'zod'

export function validate(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body)
      next()
    } catch (err) {
      next(err)
    }
  }
}