import { Request, Response, NextFunction } from 'express'
import { analyticsRepository } from '../repositories/analytics.repository'

export const analyticsController = {

  async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const summary = await analyticsRepository.getSummary()
      res.status(200).json({ data: summary })
    } catch (err) {
      next(err)
    }
  },

  async getByDepartment(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await analyticsRepository.getByDepartment()
      res.status(200).json({ data })
    } catch (err) {
      next(err)
    }
  },

  async getByCountry(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await analyticsRepository.getByCountry()
      res.status(200).json({ data })
    } catch (err) {
      next(err)
    }
  },

  async getDistribution(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await analyticsRepository.getDistribution()
      res.status(200).json({ data })
    } catch (err) {
      next(err)
    }
  },

  async getTopPaid(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : 10
      const data = await analyticsRepository.getTopPaid(limit)
      res.status(200).json({ data })
    } catch (err) {
      next(err)
    }
  },
}