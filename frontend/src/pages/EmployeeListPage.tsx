import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus } from 'lucide-react'
import { useEmployees } from '@/hooks/useEmployees'
import type { Employee, EmployeeFilters } from '@/types'

// ─── Helper ───────────────────────────────────────────────────

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

// ─── Page ─────────────────────────────────────────────────────

export default function EmployeeListPage() {
  const navigate = useNavigate()

  const [searchInput, setSearchInput] = useState(''); 

  const [filters, setFilters] = useState<EmployeeFilters>({
    page: 1,
    pageSize: 25,
    search: '',
  })

  // use debounce - wait for 400ms after user stops typing
  useEffect(()=>{
    const timer = setTimeout(()=>{
      setFilters(prev => ({
        ...prev,
        search: searchInput,
        page: 1
      }))
    }, 400);
    return ()=>clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isError } = useEmployees(filters)

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchInput(e.target.value);
  }

  function handlePageChange(newPage: number) {
    setFilters(prev => ({ ...prev, page: newPage }))
  }

  // ─── Loading ────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading employees...</p>
      </div>
    )
  }

  // ─── Error ──────────────────────────────────────────────────

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Failed to load employees.</p>
      </div>
    )
  }

  const employees = data?.data ?? []
  const meta = data?.meta

  // ─── Render ─────────────────────────────────────────────────

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

      {/* Search */}
      <div className="relative mb-6">
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

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Employee
              </th>
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
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Hire Date
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
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
            Page {meta.page} of {meta.totalPages}
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