import { Request, Response, NextFunction } from 'express'
import { employeeService } from '../services/employee.service'
import { EmployeeStatus } from '../types'
import { PAGINATION } from '../constants'

function parseId(value: unknown): number {
  const id = parseInt(value as string, 10)
  return isNaN(id) ? NaN : id
}

export const employeeController = {

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        search,
        department,
        country,
        status,
        sortBy,
        sortOrder,
        page,
        pageSize,
      } = req.query

      const result = await employeeService.getAll({
        search: search as string,
        department: department as string,
        country: country as string,
        status: status as EmployeeStatus,
        sortBy: sortBy as 'name' | 'salary' | 'hireDate',
        sortOrder: sortOrder as 'asc' | 'desc',
        page: page ? parseInt(page as string, 10) : PAGINATION.DEFAULT_PAGE,
        pageSize: pageSize
          ? Math.min(parseInt(pageSize as string, 10), PAGINATION.MAX_PAGE_SIZE)
          : PAGINATION.DEFAULT_PAGE_SIZE,
      })

      res.status(200).json(result)
    } catch (err) {
      next(err)
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseId(req.params.id)
      if (isNaN(id)) {
        res.status(400).json({
          error: { code: 'VALIDATION_ERROR', message: 'Invalid employee ID' }
        })
        return
      }

      const employee = await employeeService.getById(id)
      res.status(200).json({ data: employee })
    } catch (err) {
      next(err)
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const employee = await employeeService.create(req.body)
      res.status(201).json({ data: employee })
    } catch (err) {
      next(err)
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseId(req.params.id)
      if (isNaN(id)) {
        res.status(400).json({
          error: { code: 'VALIDATION_ERROR', message: 'Invalid employee ID' }
        })
        return
      }

      const employee = await employeeService.update(id, req.body)
      res.status(200).json({ data: employee })
    } catch (err) {
      next(err)
    }
  },

  async deactivate(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseId(req.params.id)
      if (isNaN(id)) {
        res.status(400).json({
          error: { code: 'VALIDATION_ERROR', message: 'Invalid employee ID' }
        })
        return
      }

      const employee = await employeeService.deactivate(id)
      res.status(200).json({ data: employee })
    } catch (err) {
      next(err)
    }
  },

  async addSalary(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseId(req.params.id)
      if (isNaN(id)) {
        res.status(400).json({
          error: { code: 'VALIDATION_ERROR', message: 'Invalid employee ID' }
        })
        return
      }

      const employee = await employeeService.addSalary(id, req.body)
      res.status(201).json({ data: employee })
    } catch (err) {
      next(err)
    }
  },

  async getSalaryHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseId(req.params.id)
      if (isNaN(id)) {
        res.status(400).json({
          error: { code: 'VALIDATION_ERROR', message: 'Invalid employee ID' }
        })
        return
      }

      const history = await employeeService.getSalaryHistory(id)
      res.status(200).json({ data: history })
    } catch (err) {
      next(err)
    }
  },
}