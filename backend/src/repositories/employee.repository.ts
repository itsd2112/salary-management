import prisma from '../lib/prisma';
import { EmployeeStatus, EmployeeFilters, PaginatedResponse } from '../types'
import { Prisma } from '@prisma/client'

export type EmployeeWithCurrentSalary = Prisma.EmployeeGetPayload<{
  include: {
    department: true
    country: true
    salaryHistory: {
      orderBy: { effectiveDate: 'desc' }
      take: 1
    }
  }
}>

export const employeeRepository = {

     async findMany(filters: EmployeeFilters): Promise<PaginatedResponse<EmployeeWithCurrentSalary>> {
        const {
        search,
        department,
        country,
        status = EmployeeStatus.ACTIVE,
        sortBy = 'name',
        sortOrder = 'asc',
        page = 1,
        pageSize = 25,
        } = filters

        // Build where clause
        const where: Prisma.EmployeeWhereInput = {
            status,
            ...(search && {
                OR: [
                { firstName: { contains: search } },
                { lastName: { contains: search } },
                { employeeCode: { contains: search } },
                ],
            }),
            ...(department && {
                department: { name: department },
            }),
            ...(country && {
                country: { name: country },
            }),
        }

        // Build order by
        const orderBy: Prisma.EmployeeOrderByWithRelationInput =
            sortBy === 'hireDate'
                ? { hireDate: sortOrder }
                : sortBy === 'salary'
                ? { salaryHistory: { _count: sortOrder } }
                : { lastName: sortOrder }

        const skip = (page - 1) * pageSize

        // Run count and data queries in parallel
        const [total, data] = await Promise.all([
            prisma.employee.count({ where }),
            prisma.employee.findMany({
                where,
                orderBy,
                skip,
                take: pageSize,
                include: {
                department: true,
                country: true,
                salaryHistory: {
                    orderBy: { effectiveDate: 'desc' },
                    take: 1,
                },
                },
            }),
        ])

        return {
            data,
            meta: {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize),
            },
        }
    },
    
    async findById(id: number): Promise<EmployeeWithCurrentSalary | null> {
        return prisma.employee.findUnique({
            where: { id },
            include: {
                department: true,
                country: true,
                salaryHistory: {
                    orderBy: { effectiveDate: 'desc' },
                    take: 1,
                },
            },
        })
    },
    async findByEmail(email: string) {
        return prisma.employee.findUnique({
            where: { email },
        });
    },

    async create(data: Prisma.EmployeeCreateInput) {
        return prisma.employee.create({
        data,
        include: {
            department: true,
            country: true,
            salaryHistory: {
                orderBy: { effectiveDate: 'desc' },
                take: 1,
            },
        },
        })
    },

     async update(id: number, data: Prisma.EmployeeUpdateInput) {
        return prisma.employee.update({
            where: { id },
            data,
            include: {
                department: true,
                country: true,
                salaryHistory: {
                    orderBy: { effectiveDate: 'desc' },
                    take: 1,
                },
            },
        })
    },
    async deactivate(id: number) {
        return prisma.employee.update({
            where: { id },
            data: { status: EmployeeStatus.INACTIVE },
            include: {
                department: true,
                country: true,
                salaryHistory: {
                    orderBy: { effectiveDate: 'desc' },
                    take: 1,
                },
            },
        })
    },

}
