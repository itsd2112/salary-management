import prisma from '../lib/prisma'

export const analyticsRepository = {

  async getSummary() {
    // Get latest salary per employee using groupBy
    const employees = await prisma.employee.findMany({
      where: { status: 'ACTIVE' },
      include: {
        salaryHistory: {
          orderBy: { effectiveDate: 'desc' },
          take: 1,
        },
      },
    })

    const salaries = employees
      .map(e => e.salaryHistory[0]?.baseSalary ?? 0)
      .filter(s => s > 0)

    const totalEmployees = employees.length
    const totalPayroll = salaries.reduce((sum, s) => sum + s, 0)
    const averageSalary = totalEmployees > 0
      ? Math.round(totalPayroll / totalEmployees)
      : 0
    const highestSalary = salaries.length > 0
      ? Math.max(...salaries)
      : 0
    const lowestSalary = salaries.length > 0
      ? Math.min(...salaries)
      : 0

    return {
      totalEmployees,
      totalPayroll,
      averageSalary,
      highestSalary,
      lowestSalary,
    }
  },

  async getByDepartment() {
    const employees = await prisma.employee.findMany({
      where: { status: 'ACTIVE' },
      include: {
        department: true,
        salaryHistory: {
          orderBy: { effectiveDate: 'desc' },
          take: 1,
        },
      },
    })

    // Group by department
    const grouped = new Map<string, number[]>()

    for (const emp of employees) {
      const salary = emp.salaryHistory[0]?.baseSalary ?? 0
      const dept = emp.department.name
      if (!grouped.has(dept)) grouped.set(dept, [])
      grouped.get(dept)!.push(salary)
    }

    return Array.from(grouped.entries()).map(([department, salaries]) => ({
      department,
      employeeCount: salaries.length,
      totalPayroll: salaries.reduce((sum, s) => sum + s, 0),
      averageSalary: Math.round(
        salaries.reduce((sum, s) => sum + s, 0) / salaries.length
      ),
    })).sort((a, b) => b.totalPayroll - a.totalPayroll)
  },

  async getByCountry() {
    const employees = await prisma.employee.findMany({
      where: { status: 'ACTIVE' },
      include: {
        country: true,
        salaryHistory: {
          orderBy: { effectiveDate: 'desc' },
          take: 1,
        },
      },
    })

    // Group by country
    const grouped = new Map<string, {
      salaries: number[]
      currencyCode: string
    }>()

    for (const emp of employees) {
      const salary = emp.salaryHistory[0]?.baseSalary ?? 0
      const country = emp.country.name
      const currencyCode = emp.country.currencyCode

      if (!grouped.has(country)) {
        grouped.set(country, { salaries: [], currencyCode })
      }
      grouped.get(country)!.salaries.push(salary)
    }

    return Array.from(grouped.entries()).map(([country, { salaries, currencyCode }]) => ({
      country,
      currencyCode,
      employeeCount: salaries.length,
      totalPayroll: salaries.reduce((sum, s) => sum + s, 0),
      averageSalary: Math.round(
        salaries.reduce((sum, s) => sum + s, 0) / salaries.length
      ),
    })).sort((a, b) => b.employeeCount - a.employeeCount)
  },

  async getDistribution() {
    const employees = await prisma.employee.findMany({
      where: { status: 'ACTIVE' },
      include: {
        salaryHistory: {
          orderBy: { effectiveDate: 'desc' },
          take: 1,
        },
      },
    })

    const salaries = employees
      .map(e => e.salaryHistory[0]?.baseSalary ?? 0)
      .filter(s => s > 0)

    // Create 10 salary bands
    const min = Math.min(...salaries)
    const max = Math.max(...salaries)
    const bandSize = Math.ceil((max - min) / 10)

    const bands = Array.from({ length: 10 }, (_, i) => {
      const bandMin = min + i * bandSize
      const bandMax = bandMin + bandSize
      return {
        band: `${Math.round(bandMin / 1000)}k - ${Math.round(bandMax / 1000)}k`,
        min: bandMin,
        max: bandMax,
        count: salaries.filter(s => s >= bandMin && s < bandMax).length,
      }
    })

    return bands
  },

  async getTopPaid(limit: number = 10) {
    const employees = await prisma.employee.findMany({
      where: { status: 'ACTIVE' },
      include: {
        department: true,
        country: true,
        salaryHistory: {
          orderBy: { effectiveDate: 'desc' },
          take: 1,
        },
      },
    })

    return employees
      .filter(e => e.salaryHistory[0])
      .map(e => ({
        id: e.id,
        employeeCode: e.employeeCode,
        firstName: e.firstName,
        lastName: e.lastName,
        department: e.department.name,
        country: e.country.name,
        baseSalary: e.salaryHistory[0].baseSalary,
        bonus: e.salaryHistory[0].bonus,
      }))
      .sort((a, b) => b.baseSalary - a.baseSalary)
      .slice(0, limit)
  },
}