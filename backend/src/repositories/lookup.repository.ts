import prisma from '../lib/prisma'

export const lookupRepository = {
  async getDepartments() {
    return prisma.department.findMany({
      orderBy: { name: 'asc' },
    })
  },

  async getCountries() {
    return prisma.country.findMany({
      orderBy: { name: 'asc' },
    })
  },

  async getDepartmentById(id: number) {
    return prisma.department.findUnique({
      where: { id },
    })
  },

  async getCountryById(id: number) {
    return prisma.country.findUnique({
      where: { id },
    })
  },
}