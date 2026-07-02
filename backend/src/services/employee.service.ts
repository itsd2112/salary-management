import { employeeRepository } from '../repositories/employee.repository'
import { salaryHistoryRepository } from '../repositories/salaryHistory.repository'
import { AppError } from '../middleware/errorHandler'
import { EmployeeStatus } from '../types'
import type {
    CreateEmployeeInput,
    UpdateEmployeeInput,
    AddSalaryInput,
    EmployeeFilters,
} from '../types'
import prisma from '../lib/prisma'

async function generateEmployeeCode(): Promise<string> {
    const count = await prisma.employee.count()
    return `EMP-${String(count + 1).padStart(5, '0')}`
}

export const employeeService = {


    async getAll(filters: EmployeeFilters) {
        return employeeRepository.findMany(filters)
    },

    async getById(id: number) {
        const employee = await employeeRepository.findById(id)
        if (!employee) {
            throw new AppError(404, 'NOT_FOUND', `Employee with id ${id} not found`)
        }
        return employee
    },

    async create(input: CreateEmployeeInput) {
        // Check for duplicate email
        const existing = await employeeRepository.findByEmail(input.email)
        if (existing) {
            throw new AppError(409, 'CONFLICT', 'An employee with this email already exists')
        }
        // Generate unique employee code
        const employeeCode = await generateEmployeeCode()
        // Create employee + initial salary in a single transaction
        const employee = await prisma.$transaction(async (tx) => {
            const created = await tx.employee.create({
                data: {
                    employeeCode,
                    firstName: input.firstName,
                    lastName: input.lastName,
                    email: input.email,
                    departmentId: input.departmentId,
                    countryId: input.countryId,
                    jobLevel: input.jobLevel,
                    hireDate: new Date(input.hireDate),
                    status: EmployeeStatus.ACTIVE,
                },
                include: {
                    department: true,
                    country: true,
                },
            })

            await tx.salaryHistory.create({
                data: {
                    employeeId: created.id,
                    baseSalary: input.salary.baseSalary,
                    bonus: input.salary.bonus ?? 0,
                    effectiveDate: new Date(input.salary.effectiveDate),
                    reason: input.salary.reason,
                },
            })

            return created
        })

        // Fetch with salary history included
        return employeeRepository.findById(employee.id)
    },

    async update(id: number, input: UpdateEmployeeInput) {
        // Check employee exists
        const employee = await employeeRepository.findById(id)
        if (!employee) {
            throw new AppError(404, 'NOT_FOUND', `Employee with id ${id} not found`)
        }

        // Check email uniqueness if email is being changed
        if (input.email && input.email !== employee.email) {
            const existing = await employeeRepository.findByEmail(input.email)
            if (existing) {
                throw new AppError(409, 'CONFLICT', 'An employee with this email already exists')
            }
        }

        return employeeRepository.update(id, {
            ...input,
            ...(input.hireDate && { hireDate: new Date(input.hireDate) }),
        })
    },

    async deactivate(id: number) {
        const employee = await employeeRepository.findById(id)
        if (!employee) {
            throw new AppError(404, 'NOT_FOUND', `Employee with id ${id} not found`)
        }

        if (employee.status === EmployeeStatus.INACTIVE) {
            throw new AppError(422, 'BUSINESS_RULE_VIOLATION', 'Employee is already inactive')
        }

        return employeeRepository.deactivate(id)
    },

    async addSalary(id: number, input: AddSalaryInput) {
        const employee = await employeeRepository.findById(id)
        if (!employee) {
            throw new AppError(404, 'NOT_FOUND', `Employee with id ${id} not found`)
        }

        if (employee.status === EmployeeStatus.INACTIVE) {
            throw new AppError(422, 'BUSINESS_RULE_VIOLATION', 'Cannot update salary of an inactive employee')
        }

        await salaryHistoryRepository.create({
            employee: { connect: { id } },
            baseSalary: input.baseSalary,
            bonus: input.bonus ?? 0,
            effectiveDate: new Date(input.effectiveDate),
            reason: input.reason,
        })

        return employeeRepository.findById(id)
    },

    async getSalaryHistory(id: number) {
        const employee = await employeeRepository.findById(id)
        if (!employee) {
            throw new AppError(404, 'NOT_FOUND', `Employee with id ${id} not found`)
        }

        return salaryHistoryRepository.findByEmployeeId(id)
    },
}