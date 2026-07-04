export enum JobLevel {
    Junior = 'Junior',
    MID = 'MID',
    SENIOR = 'SENIOR',
    LEAD = 'LEAD',
    MANAGER = 'MANAGER',
    DIRECTOR = 'DIRECTOR',
}

export enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum SalaryReason {
  NEW_HIRE = 'NEW_HIRE',
  RAISE = 'RAISE',
  PROMOTION = 'PROMOTION',
  CORRECTION = 'CORRECTION',
}
export interface AddSalaryInput {
  baseSalary: number
  bonus?: number
  effectiveDate: string
  reason: SalaryReason
}

export interface CreateEmployeeInput {
  firstName: string
  lastName: string
  email: string
  departmentId: number
  countryId: number
  jobLevel: JobLevel
  hireDate: string
  salary: {
    baseSalary: number
    bonus?: number
    effectiveDate: string
    reason: SalaryReason
  }
}

// --Lookup Types--
export interface Department {
    id: number,
    name: string
}

export interface Country {
  id: number
  name: string
  currencyCode: string
}

// ─── Salary ───────────────────────────────────────────────────

export interface SalaryHistory {
  id: number
  employeeId: number
  baseSalary: number
  bonus: number
  effectiveDate: string
  reason: SalaryReason
  createdAt: string
}

// ─── Employee ─────────────────────────────────────────────────

export interface Employee {
  id: number
  employeeCode: string
  firstName: string
  lastName: string
  email: string
  departmentId: number
  countryId: number
  jobLevel: JobLevel
  hireDate: string
  status: EmployeeStatus
  createdAt: string
  updatedAt: string
  department: Department
  country: Country
  salaryHistory: SalaryHistory[]
}

// ─── Pagination ───────────────────────────────────────────────

export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

// ─── API Response ─────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
}

// ─── Employee Filters ─────────────────────────────────────────

export interface EmployeeFilters {
  search?: string
  department?: string
  country?: string
  status?: EmployeeStatus
  sortBy?: 'name' | 'salary' | 'hireDate'
  sortOrder?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}