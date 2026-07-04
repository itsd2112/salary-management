import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus } from 'lucide-react'
import { useEmployees } from '@/hooks/useEmployees'
import { useDepartments, useCountries } from '@/hooks/useLookup'
import type { Employee, EmployeeFilters } from '@/types'

// ─── Helpers ──────────────────────────────────────────────────

function formatSalary(employee: Employee): string {
  const current = employee.salaryHistory[0]
  if (!current) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: employee.country.currencyCode,
    maximumFractionDigits: 0,
  }).format(current.baseSalary)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// ─── Sort Header Component ────────────────────────────────────

function SortHeader({
  label,
  field,
  currentSort,
  currentOrder,
  onSort,
}: {
  label: string
  field: string
  currentSort: string
  currentOrder: string
  onSort: (field: string) => void
}) {
  const isActive = currentSort === field
  return (
    <th
      onClick={() => onSort(field)}
      className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer hover:text-gray-900 select-none"
    >
      <span className="flex items-center gap-1">
        {label}
        <span className="text-gray-400">
          {isActive ? (currentOrder === 'asc' ? '↑' : '↓') : '↕'}
        </span>
      </span>
    </th>
  )
}

// ─── Page ─────────────────────────────────────────────────────

export default function EmployeeListPage() {
  const navigate = useNavigate()

  const [searchInput, setSearchInput] = useState('')
  const [filters, setFilters] = useState<EmployeeFilters>({
    page: 1,
    pageSize: 25,
    search: '',
    department: '',
    country: '',
    sortBy: 'name',
    sortOrder: 'asc',
  })

  const { data, isLoading, isError } = useEmployees(filters)
  const { data: departmentsData } = useDepartments()
  const { data: countriesData } = useCountries()

  const departments = departmentsData?.data ?? []
  const countries = countriesData?.data ?? []

  // ─── Handlers ─────────────────────────────────────────────

  // Debounced search
  const [searchTimer, setSearchTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setSearchInput(value)

    if (searchTimer) clearTimeout(searchTimer)
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: value, page: 1 }))
    }, 400)
    setSearchTimer(timer)
  }

  function handleDepartmentFilter(e: React.ChangeEvent<HTMLSelectElement>) {
    setFilters(prev => ({
      ...prev,
      department: e.target.value,
      page: 1,
    }))
  }

  function handleCountryFilter(e: React.ChangeEvent<HTMLSelectElement>) {
    setFilters(prev => ({
      ...prev,
      country: e.target.value,
      page: 1,
    }))
  }

  function handleSort(field: string) {
    setFilters(prev => ({
      ...prev,
      sortBy: field as EmployeeFilters['sortBy'],
      sortOrder:
        prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
      page: 1,
    }))
  }

  function handlePageChange(newPage: number) {
    setFilters(prev => ({ ...prev, page: newPage }))
  }

  function handleClearFilters() {
    setSearchInput('')
    setFilters({
      page: 1,
      pageSize: 25,
      search: '',
      department: '',
      country: '',
      sortBy: 'name',
      sortOrder: 'asc',
    })
  }

  const hasActiveFilters =
    filters.search || filters.department || filters.country

  // ─── Loading ──────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading employees...</p>
      </div>
    )
  }

  // ─── Error ────────────────────────────────────────────────

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Failed to load employees.</p>
      </div>
    )
  }

  const employees = data?.data ?? []
  const meta = data?.meta

  // ─── Render ───────────────────────────────────────────────

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Employees
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {meta?.total ?? 0} total employees
          </p>
        </div>
        <button
          onClick={() => navigate('/employees/new')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add Employee
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">

        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by name or employee code..."
            value={searchInput}
            onChange={handleSearch}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Department filter */}
        <select
          value={filters.department}
          onChange={handleDepartmentFilter}
          className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-600"
        >
          <option value="">All Departments</option>
          {departments.map(d => (
            <option key={d.id} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>

        {/* Country filter */}
        <select
          value={filters.country}
          onChange={handleCountryFilter}
          className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-600"
        >
          <option value="">All Countries</option>
          {countries.map(c => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-md hover:bg-gray-50"
          >
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <SortHeader
                label="Employee"
                field="name"
                currentSort={filters.sortBy ?? 'name'}
                currentOrder={filters.sortOrder ?? 'asc'}
                onSort={handleSort}
              />
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Department
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Country
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Level
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Salary
              </th>
              <SortHeader
                label="Hire Date"
                field="hireDate"
                currentSort={filters.sortBy ?? 'name'}
                currentOrder={filters.sortOrder ?? 'asc'}
                onSort={handleSort}
              />
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr
                key={employee.id}
                onClick={() => navigate(`/employees/${employee.id}`)}
                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">
                    {employee.firstName} {employee.lastName}
                  </div>
                  <div className="text-xs text-gray-400">
                    {employee.employeeCode}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {employee.department.name}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {employee.country.name}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {employee.jobLevel}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {formatSalary(employee)}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {formatDate(employee.hireDate)}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    employee.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {employee.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty state */}
        {employees.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No employees found
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            Showing {(meta.page - 1) * meta.pageSize + 1} to{' '}
            {Math.min(meta.page * meta.pageSize, meta.total)} of {meta.total}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(meta.page - 1)}
              disabled={meta.page === 1}
              className="px-3 py-1 text-sm border border-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(meta.page + 1)}
              disabled={meta.page === meta.totalPages}
              className="px-3 py-1 text-sm border border-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

    </div>
  )
}