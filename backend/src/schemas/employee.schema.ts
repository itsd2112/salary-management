import { z } from 'zod'
import { JobLevel, SalaryReason } from '../types'

// ─── Salary Schema ────────────────────────────────────────────

export const addSalarySchema = z.object({
  baseSalary: z
    .number({ message: 'Base salary must be a number' })
    .nonnegative('Base salary must be non-negative'),
  bonus: z
    .number()
    .nonnegative('Bonus must be non-negative')
    .optional()
    .default(0),
  effectiveDate: z
    .string({ message: 'Effective date is required' })
    .min(1, 'Effective date is required'),
  reason: z.enum(
    [
      SalaryReason.NEW_HIRE,
      SalaryReason.RAISE,
      SalaryReason.PROMOTION,
      SalaryReason.CORRECTION,
    ],
    { message: 'Invalid salary reason' }
  ),
})

// ─── Create Employee Schema ───────────────────────────────────

export const createEmployeeSchema = z.object({
  firstName: z
    .string({ message: 'First name is required' })
    .min(1, 'First name is required')
    .max(50, 'First name must be under 50 characters'),
  lastName: z
    .string({ message: 'Last name is required' })
    .min(1, 'Last name is required')
    .max(50, 'Last name must be under 50 characters'),
  email: z
    .string({ message: 'Email is required' })
    .email('Invalid email address'),
  departmentId: z
    .number({ message: 'Department is required' })
    .int('Department ID must be an integer')
    .positive('Department ID must be positive'),
  countryId: z
    .number({ message: 'Country is required' })
    .int('Country ID must be an integer')
    .positive('Country ID must be positive'),
  jobLevel: z.enum(
    [
      JobLevel.JUNIOR,
      JobLevel.MID,
      JobLevel.SENIOR,
      JobLevel.LEAD,
      JobLevel.MANAGER,
      JobLevel.DIRECTOR,
    ],
    { message: 'Invalid job level' }
  ),
  hireDate: z
    .string({ message: 'Hire date is required' })
    .min(1, 'Hire date is required'),
  salary: addSalarySchema,
})

// ─── Update Employee Schema ───────────────────────────────────

export const updateEmployeeSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be under 50 characters')
    .optional(),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be under 50 characters')
    .optional(),
  email: z
    .string()
    .email('Invalid email address')
    .optional(),
  departmentId: z
    .number()
    .int('Department ID must be an integer')
    .positive('Department ID must be positive')
    .optional(),
  countryId: z
    .number()
    .int('Country ID must be an integer')
    .positive('Country ID must be positive')
    .optional(),
  jobLevel: z
    .enum([
      JobLevel.JUNIOR,
      JobLevel.MID,
      JobLevel.SENIOR,
      JobLevel.LEAD,
      JobLevel.MANAGER,
      JobLevel.DIRECTOR,
    ])
    .optional(),
  hireDate: z.string().optional(),
})