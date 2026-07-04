import { Request, Response, NextFunction } from 'express'
import { lookupRepository } from '../repositories/lookup.repository'

export const lookupController = {

  async getDepartments(req: Request, res: Response, next: NextFunction) {
    try {
      const departments = await lookupRepository.getDepartments()
      res.status(200).json({ data: departments })
    } catch (err) {
      next(err)
    }
  },

  async getCountries(req: Request, res: Response, next: NextFunction) {
    try {
      const countries = await lookupRepository.getCountries()
      res.status(200).json({ data: countries })
    } catch (err) {
      next(err)
    }
  },
}