import { analyticsRepository } from '../../src/repositories/analytics.repository'

jest.mock('../../src/repositories/analytics.repository')

const mockAnalyticsRepo = analyticsRepository as jest.Mocked<typeof analyticsRepository>

// ─── Mock Data ────────────────────────────────────────────────

const mockSummary = {
  totalEmployees: 10000,
  totalPayroll: 950000000,
  averageSalary: 95000,
  highestSalary: 250000,
  lowestSalary: 30000,
}

const mockByDepartment = [
  {
    department: 'Engineering',
    employeeCount: 1500,
    totalPayroll: 150000000,
    averageSalary: 100000,
  },
  {
    department: 'Finance',
    employeeCount: 800,
    totalPayroll: 72000000,
    averageSalary: 90000,
  },
]

const mockByCountry = [
  {
    country: 'United States',
    currencyCode: 'USD',
    employeeCount: 3000,
    totalPayroll: 300000000,
    averageSalary: 100000,
  },
  {
    country: 'India',
    currencyCode: 'INR',
    employeeCount: 2500,
    totalPayroll: 175000000,
    averageSalary: 70000,
  },
]

const mockDistribution = [
  { band: '30k - 52k', min: 30000, max: 52000, count: 1200 },
  { band: '52k - 74k', min: 52000, max: 74000, count: 2100 },
  { band: '74k - 96k', min: 74000, max: 96000, count: 2800 },
  { band: '96k - 118k', min: 96000, max: 118000, count: 1900 },
  { band: '118k - 140k', min: 118000, max: 140000, count: 1200 },
]

const mockTopPaid = [
  {
    id: 1,
    employeeCode: 'EMP-00001',
    firstName: 'John',
    lastName: 'Doe',
    department: 'Engineering',
    country: 'United States',
    baseSalary: 250000,
    bonus: 50000,
  },
  {
    id: 2,
    employeeCode: 'EMP-00002',
    firstName: 'Jane',
    lastName: 'Smith',
    department: 'Finance',
    country: 'United States',
    baseSalary: 240000,
    bonus: 45000,
  },
]

// ─── Tests ────────────────────────────────────────────────────

describe('analyticsRepository', () => {

  // ─── getSummary ───────────────────────────────────────────────

  describe('getSummary', () => {
    it('returns correct summary metrics', async () => {
      mockAnalyticsRepo.getSummary.mockResolvedValue(mockSummary)

      const result = await analyticsRepository.getSummary()

      expect(result.totalEmployees).toBe(10000)
      expect(result.totalPayroll).toBe(950000000)
      expect(result.averageSalary).toBe(95000)
      expect(result.highestSalary).toBe(250000)
      expect(result.lowestSalary).toBe(30000)
    })

    it('returns all required fields', async () => {
      mockAnalyticsRepo.getSummary.mockResolvedValue(mockSummary)

      const result = await analyticsRepository.getSummary()

      expect(result).toHaveProperty('totalEmployees')
      expect(result).toHaveProperty('totalPayroll')
      expect(result).toHaveProperty('averageSalary')
      expect(result).toHaveProperty('highestSalary')
      expect(result).toHaveProperty('lowestSalary')
    })
  })

  // ─── getByDepartment ──────────────────────────────────────────

  describe('getByDepartment', () => {
    it('returns department breakdown', async () => {
      mockAnalyticsRepo.getByDepartment.mockResolvedValue(mockByDepartment)

      const result = await analyticsRepository.getByDepartment()

      expect(result).toHaveLength(2)
      expect(result[0].department).toBe('Engineering')
      expect(result[0].employeeCount).toBe(1500)
      expect(result[0].totalPayroll).toBe(150000000)
      expect(result[0].averageSalary).toBe(100000)
    })

    it('returns departments sorted by total payroll descending', async () => {
      mockAnalyticsRepo.getByDepartment.mockResolvedValue(mockByDepartment)

      const result = await analyticsRepository.getByDepartment()

      expect(result[0].totalPayroll).toBeGreaterThanOrEqual(result[1].totalPayroll)
    })

    it('returns all required fields per department', async () => {
      mockAnalyticsRepo.getByDepartment.mockResolvedValue(mockByDepartment)

      const result = await analyticsRepository.getByDepartment()

      result.forEach(dept => {
        expect(dept).toHaveProperty('department')
        expect(dept).toHaveProperty('employeeCount')
        expect(dept).toHaveProperty('totalPayroll')
        expect(dept).toHaveProperty('averageSalary')
      })
    })
  })

  // ─── getByCountry ─────────────────────────────────────────────

  describe('getByCountry', () => {
    it('returns country breakdown', async () => {
      mockAnalyticsRepo.getByCountry.mockResolvedValue(mockByCountry)

      const result = await analyticsRepository.getByCountry()

      expect(result).toHaveLength(2)
      expect(result[0].country).toBe('United States')
      expect(result[0].currencyCode).toBe('USD')
    })

    it('returns all required fields per country', async () => {
      mockAnalyticsRepo.getByCountry.mockResolvedValue(mockByCountry)

      const result = await analyticsRepository.getByCountry()

      result.forEach(country => {
        expect(country).toHaveProperty('country')
        expect(country).toHaveProperty('currencyCode')
        expect(country).toHaveProperty('employeeCount')
        expect(country).toHaveProperty('totalPayroll')
        expect(country).toHaveProperty('averageSalary')
      })
    })
  })

  // ─── getDistribution ──────────────────────────────────────────

  describe('getDistribution', () => {
    it('returns salary distribution bands', async () => {
      mockAnalyticsRepo.getDistribution.mockResolvedValue(mockDistribution)

      const result = await analyticsRepository.getDistribution()

      expect(result).toHaveLength(5)
      expect(result[0]).toHaveProperty('band')
      expect(result[0]).toHaveProperty('min')
      expect(result[0]).toHaveProperty('max')
      expect(result[0]).toHaveProperty('count')
    })

    it('returns bands with non-negative counts', async () => {
      mockAnalyticsRepo.getDistribution.mockResolvedValue(mockDistribution)

      const result = await analyticsRepository.getDistribution()

      result.forEach(band => {
        expect(band.count).toBeGreaterThanOrEqual(0)
      })
    })

    it('returns bands where min is less than max', async () => {
      mockAnalyticsRepo.getDistribution.mockResolvedValue(mockDistribution)

      const result = await analyticsRepository.getDistribution()

      result.forEach(band => {
        expect(band.min).toBeLessThan(band.max)
      })
    })
  })

  // ─── getTopPaid ───────────────────────────────────────────────

  describe('getTopPaid', () => {
    it('returns top paid employees', async () => {
      mockAnalyticsRepo.getTopPaid.mockResolvedValue(mockTopPaid)

      const result = await analyticsRepository.getTopPaid(10)

      expect(result).toHaveLength(2)
      expect(result[0].baseSalary).toBe(250000)
    })

    it('returns employees sorted by salary descending', async () => {
      mockAnalyticsRepo.getTopPaid.mockResolvedValue(mockTopPaid)

      const result = await analyticsRepository.getTopPaid(10)

      expect(result[0].baseSalary).toBeGreaterThanOrEqual(result[1].baseSalary)
    })

    it('returns all required fields', async () => {
      mockAnalyticsRepo.getTopPaid.mockResolvedValue(mockTopPaid)

      const result = await analyticsRepository.getTopPaid(10)

      result.forEach(emp => {
        expect(emp).toHaveProperty('id')
        expect(emp).toHaveProperty('employeeCode')
        expect(emp).toHaveProperty('firstName')
        expect(emp).toHaveProperty('lastName')
        expect(emp).toHaveProperty('department')
        expect(emp).toHaveProperty('country')
        expect(emp).toHaveProperty('baseSalary')
        expect(emp).toHaveProperty('bonus')
      })
    })
  })

})