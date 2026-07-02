import { Router } from 'express'
import { employeeController } from '../controllers/employee.controller'
import { validate } from '../middleware/validate'
import { createEmployeeSchema, updateEmployeeSchema, addSalarySchema } from '../schemas/employee.schema'

const router = Router()

// List and create
router.get('/', employeeController.getAll)
router.post('/', validate(createEmployeeSchema), employeeController.create)

// Single employee
router.get('/:id', employeeController.getById)
router.patch('/:id', validate(updateEmployeeSchema), employeeController.update)
router.post('/:id/deactivate', employeeController.deactivate)

// Salary
router.get('/:id/salary-history', employeeController.getSalaryHistory)
router.post('/:id/salary', validate(addSalarySchema), employeeController.addSalary)

export default router