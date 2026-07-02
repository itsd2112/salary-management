import { JobLevel, EmployeeStatus, SalaryReason } from '@prisma/client'

// re-export Prisma enums so rest of codebase
// imports from one place not directly from @prisma/client
export { JobLevel, EmployeeStatus, SalaryReason }

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

// ─── Employee Inputs ──────────────────────────────────────────

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

export interface UpdateEmployeeInput {
  firstName?: string
  lastName?: string
  email?: string
  departmentId?: number
  countryId?: number
  jobLevel?: JobLevel
  hireDate?: string
}

export interface AddSalaryInput {
  baseSalary: number
  bonus?: number
  effectiveDate: string
  reason: SalaryReason
}

// ─── API Response ─────────────────────────────────────────────

export interface ApiError {
  code: string
  message: string
}