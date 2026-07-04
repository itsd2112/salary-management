import { employeeService } from '../../src/services/employee.service'
import { employeeRepository } from '../../src/repositories/employee.repository'
import { salaryHistoryRepository } from '../../src/repositories/salaryHistory.repository'
import { AppError } from '../../src/middleware/errorHandler'
import { EmployeeStatus, JobLevel, SalaryReason } from '@prisma/client'

// ─── Mock Repositories ────────────────────────────────────────

jest.mock('../../src/repositories/employee.repository')
jest.mock('../../src/repositories/salaryHistory.repository')
jest.mock('../../src/lib/prisma')

const mockEmployeeRepo = employeeRepository as jest.Mocked<typeof employeeRepository>
const mockSalaryRepo = salaryHistoryRepository as jest.Mocked<typeof salaryHistoryRepository>

// ─── Mock Data ────────────────────────────────────────────────

const mockEmployee = {
  id: 1,
  employeeCode: 'EMP-00001',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@acme.com',
  departmentId: 1,
  countryId: 1,
  jobLevel: JobLevel.SENIOR,
  hireDate: new Date('2024-01-15'),
  status: EmployeeStatus.ACTIVE,
  createdAt: new Date(),
  updatedAt: new Date(),
  department: { id: 1, name: 'Engineering' },
  country: { id: 1, name: 'United States', currencyCode: 'USD' },
  salaryHistory: [
    {
      id: 1,
      employeeId: 1,
      baseSalary: 90000,
      bonus: 5000,
      effectiveDate: new Date('2024-01-15'),
      reason: SalaryReason.NEW_HIRE,
      createdAt: new Date(),
    },
  ],
}

// ─── Tests ────────────────────────────────────────────────────

describe('employeeService', () => {

  // ─── getById ────────────────────────────────────────────────

  describe('getById', () => {
    it('returns employee when found', async () => {
      mockEmployeeRepo.findById.mockResolvedValue(mockEmployee)

      const result = await employeeService.getById(1)

      expect(result).toEqual(mockEmployee)
      expect(mockEmployeeRepo.findById).toHaveBeenCalledWith(1)
    })

    it('throws 404 when employee not found', async () => {
      mockEmployeeRepo.findById.mockResolvedValue(null)

      await expect(employeeService.getById(999)).rejects.toThrow(AppError)
      await expect(employeeService.getById(999)).rejects.toMatchObject({
        statusCode: 404,
        code: 'NOT_FOUND',
      })
    })
  })

  // ─── update ─────────────────────────────────────────────────

  describe('update', () => {
    it('updates employee successfully', async () => {
      mockEmployeeRepo.findById.mockResolvedValue(mockEmployee)
      mockEmployeeRepo.update.mockResolvedValue({
        ...mockEmployee,
        firstName: 'Jane',
      })

      const result = await employeeService.update(1, { firstName: 'Jane' })

      expect(result.firstName).toBe('Jane')
      expect(mockEmployeeRepo.update).toHaveBeenCalledWith(1, { firstName: 'Jane' })
    })

    it('throws 404 when employee not found', async () => {
      mockEmployeeRepo.findById.mockResolvedValue(null)

      await expect(
        employeeService.update(999, { firstName: 'Jane' })
      ).rejects.toMatchObject({
        statusCode: 404,
        code: 'NOT_FOUND',
      })
    })

    it('throws 409 when email already exists', async () => {
      mockEmployeeRepo.findById.mockResolvedValue(mockEmployee)
      mockEmployeeRepo.findByEmail.mockResolvedValue({
        ...mockEmployee,
        id: 2,
        email: 'existing@acme.com',
      })

      await expect(
        employeeService.update(1, { email: 'existing@acme.com' })
      ).rejects.toMatchObject({
        statusCode: 409,
        code: 'CONFLICT',
      })
    })
  })

  // ─── deactivate ──────────────────────────────────────────────

  describe('deactivate', () => {
    it('deactivates an active employee', async () => {
      mockEmployeeRepo.findById.mockResolvedValue(mockEmployee)
      mockEmployeeRepo.deactivate.mockResolvedValue({
        ...mockEmployee,
        status: EmployeeStatus.INACTIVE,
      })

      const result = await employeeService.deactivate(1)

      expect(result.status).toBe(EmployeeStatus.INACTIVE)
      expect(mockEmployeeRepo.deactivate).toHaveBeenCalledWith(1)
    })

    it('throws 404 when employee not found', async () => {
      mockEmployeeRepo.findById.mockResolvedValue(null)

      await expect(employeeService.deactivate(999)).rejects.toMatchObject({
        statusCode: 404,
        code: 'NOT_FOUND',
      })
    })

    it('throws 422 when employee is already inactive', async () => {
      mockEmployeeRepo.findById.mockResolvedValue({
        ...mockEmployee,
        status: EmployeeStatus.INACTIVE,
      })

      await expect(employeeService.deactivate(1)).rejects.toMatchObject({
        statusCode: 422,
        code: 'BUSINESS_RULE_VIOLATION',
      })
    })
  })

  // ─── addSalary ───────────────────────────────────────────────

  describe('addSalary', () => {
    it('adds salary entry for active employee', async () => {
      mockEmployeeRepo.findById.mockResolvedValue(mockEmployee)
      mockSalaryRepo.create.mockResolvedValue({
        id: 2,
        employeeId: 1,
        baseSalary: 95000,
        bonus: 6000,
        effectiveDate: new Date('2025-01-15'),
        reason: SalaryReason.RAISE,
        createdAt: new Date(),
      })
      mockEmployeeRepo.findById.mockResolvedValueOnce(mockEmployee)

      const input = {
        baseSalary: 95000,
        bonus: 6000,
        effectiveDate: '2025-01-15',
        reason: SalaryReason.RAISE,
      }

      await employeeService.addSalary(1, input)

      expect(mockSalaryRepo.create).toHaveBeenCalled()
    })

    it('throws 404 when employee not found', async () => {
      mockEmployeeRepo.findById.mockResolvedValue(null)

      await expect(
        employeeService.addSalary(999, {
          baseSalary: 95000,
          effectiveDate: '2025-01-15',
          reason: SalaryReason.RAISE,
        })
      ).rejects.toMatchObject({
        statusCode: 404,
        code: 'NOT_FOUND',
      })
    })

    it('throws 422 when employee is inactive', async () => {
      mockEmployeeRepo.findById.mockResolvedValue({
        ...mockEmployee,
        status: EmployeeStatus.INACTIVE,
      })

      await expect(
        employeeService.addSalary(1, {
          baseSalary: 95000,
          effectiveDate: '2025-01-15',
          reason: SalaryReason.RAISE,
        })
      ).rejects.toMatchObject({
        statusCode: 422,
        code: 'BUSINESS_RULE_VIOLATION',
      })
    })
  })

  // ─── getSalaryHistory ────────────────────────────────────────

  describe('getSalaryHistory', () => {
    it('returns salary history for existing employee', async () => {
      mockEmployeeRepo.findById.mockResolvedValue(mockEmployee)
      mockSalaryRepo.findByEmployeeId.mockResolvedValue(
        mockEmployee.salaryHistory
      )

      const result = await employeeService.getSalaryHistory(1)

      expect(result).toEqual(mockEmployee.salaryHistory)
      expect(mockSalaryRepo.findByEmployeeId).toHaveBeenCalledWith(1)
    })

    it('throws 404 when employee not found', async () => {
      mockEmployeeRepo.findById.mockResolvedValue(null)

      await expect(employeeService.getSalaryHistory(999)).rejects.toMatchObject({
        statusCode: 404,
        code: 'NOT_FOUND',
      })
    })
  })

})