import { PrismaClient, JobLevel, EmployeeStatus, SalaryReason } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { DEPARTMENTS, COUNTRIES, JOB_LEVELS } from '../constants/index';

const prisma = new PrismaClient()

// Set a fixed seed — same output every run
faker.seed(42)


// ─── Salary Ranges by Job Level ───────────────────────────────

const SALARY_RANGES: Record<JobLevel, { min: number; max: number }> = {
  JUNIOR:   { min: 30000,  max: 60000  },
  MID:      { min: 60000,  max: 90000  },
  SENIOR:   { min: 90000,  max: 130000 },
  LEAD:     { min: 120000, max: 160000 },
  MANAGER:  { min: 130000, max: 180000 },
  DIRECTOR: { min: 160000, max: 250000 },
}

// ─── Helper Functions ─────────────────────────────────────────

function generateEmployeeCode(index: number): string {
  return `EMP-${String(index).padStart(5, '0')}`
}

function generateSalary(level: JobLevel): number {
  const range = SALARY_RANGES[level]
  return faker.number.int({ min: range.min, max: range.max })
}

function generateHireDate(): Date {
  return faker.date.between({
    from: new Date('2015-01-01'),
    to: new Date('2024-12-31'),
  })
}

// ─── Main Seed Function ───────────────────────────────────────

async function main() {
  console.log('Start database seeding...')

    // Clear existing data
    await prisma.salaryHistory.deleteMany()
    await prisma.employee.deleteMany()
    await prisma.department.deleteMany()
    await prisma.country.deleteMany()
    console.log('Cleared existing data.');

    //seed departments
    await prisma.department.createMany({
        data: [...DEPARTMENTS].map(d => ({name :d}))
    });
    const departments = await prisma.department.findMany()

    //seed countries
    await prisma.country.createMany({data: [...COUNTRIES]});
    const countries = await prisma.country.findMany()

    // Seed employees
    // Seed employees in batches of 500
    const TOTAL_EMPLOYEES = 10000
    const BATCH_SIZE = 500

    for (let batch = 0; batch < TOTAL_EMPLOYEES/BATCH_SIZE; batch++) {
        const employeeData = [];
        for(let i=0; i<BATCH_SIZE; i++){
            const index = batch * BATCH_SIZE + i + 1;
            const firstName = faker.person.firstName()
            const lastName = faker.person.lastName()
            const department = faker.helpers.arrayElement(departments)
            const country = faker.helpers.arrayElement(countries)
            const jobLevel = faker.helpers.arrayElement(JOB_LEVELS)
             employeeData.push({
                employeeCode: generateEmployeeCode(index),
                firstName,
                lastName,
                email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@acme.com`,
                departmentId: department.id,
                countryId: country.id,
                jobLevel,
                hireDate: generateHireDate(),
                status: EmployeeStatus.ACTIVE,
            })
        }
        await prisma.employee.createMany({ data: employeeData })
        console.log(
        `✓ Seeded employees ${batch * BATCH_SIZE + 1} - ${(batch + 1) * BATCH_SIZE}`
        )
    }

    // Seed salary history in batches of 500
    console.log('Seeding salary history...')
    const employees = await prisma.employee.findMany({
        select: { id: true, jobLevel: true, hireDate: true },
    })
    const HISTORY_BATCH_SIZE = 500
    for (let i = 0; i < employees.length; i+= HISTORY_BATCH_SIZE) {
        const historyData = []
        
        const batch  = employees.slice(i, i + HISTORY_BATCH_SIZE);
        // Initial NEW_HIRE entry
        for (const emp of batch) {
          const initialSalary = generateSalary(emp.jobLevel)
            historyData.push({
                employeeId: emp.id,
                baseSalary: initialSalary,
                bonus: faker.number.int({ min: 1000, max: 10000 }),
                effectiveDate: emp.hireDate,
                reason: SalaryReason.NEW_HIRE,
            });

            // 0-3 additional history entries
            const additionalEntries = faker.number.int({ min: 0, max: 3 })
            let lastDate = new Date(emp.hireDate)
            let lastSalary = initialSalary  // track last salary
            for (let j = 0; j < additionalEntries; j++) {
                lastDate = new Date(lastDate)
                lastDate.setMonth(lastDate.getMonth() + faker.number.int({ min: 6, max: 18 }))

                if (lastDate > new Date()) break
                // New salary is always 5-20% higher than previous
                  const increasePercent = faker.number.float({ min: 0.05, max: 0.20 })
                  const newSalary = Math.round(lastSalary * (1 + increasePercent))
                  lastSalary = newSalary  // update for next iteration

                historyData.push({
                    employeeId: emp.id,
                    baseSalary: newSalary,
                    bonus: faker.number.int({ min: 0, max: 10000 }),
                    effectiveDate: lastDate,
                    reason: faker.helpers.arrayElement([
                        SalaryReason.RAISE,
                        SalaryReason.PROMOTION,
                    ]),
                })
            }
        }
        await prisma.salaryHistory.createMany({ data: historyData })
        console.log(
        `✓ Seeded salary history for employees ${i + 1} - ${Math.min(i + HISTORY_BATCH_SIZE, employees.length)}`
        );
    }

}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })