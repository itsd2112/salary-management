import prisma from '../lib/prisma'
import { Prisma } from '@prisma/client'

export const salaryHistoryRepository = {

  async create(data: Prisma.SalaryHistoryCreateInput) {
    return prisma.salaryHistory.create({ data })
  },

  async findByEmployeeId(employeeId: number) {
    return prisma.salaryHistory.findMany({
      where: { employeeId },
      orderBy: { effectiveDate: 'desc' },
    })
  },

}