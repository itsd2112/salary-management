import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Building2, Globe, Briefcase, Calendar, BadgeCheck } from 'lucide-react'
import { useEmployee } from '@/hooks/useEmployees'
import type { SalaryHistory } from '@/types'

// ─── Helpers ──────────────────────────────────────────────────

function formatSalary(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function getSalaryReasonLabel(reason: string): string {
  const labels: Record<string, string> = {
    NEW_HIRE: 'New Hire',
    RAISE: 'Raise',
    PROMOTION: 'Promotion',
    CORRECTION: 'Correction',
  }
  return labels[reason] ?? reason
}

// ─── Info Row Component ───────────────────────────────────────

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
        <Icon size={15} className="text-gray-500" />
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  )
}

// ─── Salary History Row ───────────────────────────────────────

function SalaryHistoryRow({
  entry,
  currencyCode,
  isLatest,
}: {
  entry: SalaryHistory
  currencyCode: string
  isLatest: boolean
}) {
  return (
    <tr className="border-b border-gray-100">
      <td className="px-4 py-3 text-sm text-gray-600">
        {formatDate(entry.effectiveDate)}
      </td>
      <td className="px-4 py-3 text-sm font-medium text-gray-900">
        {formatSalary(entry.baseSalary, currencyCode)}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {formatSalary(entry.bonus, currencyCode)}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {formatSalary(entry.baseSalary + entry.bonus, currencyCode)}
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
          {getSalaryReasonLabel(entry.reason)}
        </span>
      </td>
      <td className="px-4 py-3">
        {isLatest && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
            Current
          </span>
        )}
      </td>
    </tr>
  )
}

// ─── Page ─────────────────────────────────────────────────────

export default function EmployeeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data, isLoading, isError } = useEmployee(Number(id))

  // ─── Loading ──────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading employee...</p>
      </div>
    )
  }

  // ─── Error ────────────────────────────────────────────────

  if (isError || !data?.data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-500 font-medium">Employee not found</p>
          <button
            onClick={() => navigate('/employees')}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            Back to employees
          </button>
        </div>
      </div>
    )
  }

  const employee = data.data
  const currentSalary = employee.salaryHistory[0]
  const currencyCode = employee.country.currencyCode

  // Sort salary history by date descending
  const sortedHistory = [...employee.salaryHistory].sort(
    (a, b) =>
      new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime()
  )

  // ─── Render ───────────────────────────────────────────────

  return (
    <div className="p-8 max-w-5xl mx-auto">

      {/* Back button */}
      <button
        onClick={() => navigate('/employees')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to employees
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-xl font-semibold text-blue-600">
              {employee.firstName[0]}{employee.lastName[0]}
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {employee.firstName} {employee.lastName}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {employee.employeeCode} · {employee.jobLevel}
            </p>
          </div>
        </div>

        {/* Status badge */}
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
          employee.status === 'ACTIVE'
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-600'
        }`}>
          <BadgeCheck size={14} />
          {employee.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">

        {/* Employee Info */}
        <div className="col-span-2 bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            Employee Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <InfoRow
              icon={Mail}
              label="Email"
              value={employee.email}
            />
            <InfoRow
              icon={Building2}
              label="Department"
              value={employee.department.name}
            />
            <InfoRow
              icon={Globe}
              label="Country"
              value={`${employee.country.name} (${currencyCode})`}
            />
            <InfoRow
              icon={Briefcase}
              label="Job Level"
              value={employee.jobLevel}
            />
            <InfoRow
              icon={Calendar}
              label="Hire Date"
              value={formatDate(employee.hireDate)}
            />
          </div>
        </div>

        {/* Current Salary Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            Current Compensation
          </h2>
          {currentSalary ? (
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400">Base Salary</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatSalary(currentSalary.baseSalary, currencyCode)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Bonus</p>
                <p className="text-lg font-semibold text-gray-700">
                  {formatSalary(currentSalary.bonus, currencyCode)}
                </p>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">Total Compensation</p>
                <p className="text-lg font-semibold text-blue-600">
                  {formatSalary(
                    currentSalary.baseSalary + currentSalary.bonus,
                    currencyCode
                  )}
                </p>
              </div>
              <p className="text-xs text-gray-400 pt-2">
                Effective {formatDate(currentSalary.effectiveDate)}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-400">No salary data</p>
          )}
        </div>
      </div>

      {/* Salary History */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">
            Salary History
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {sortedHistory.length} records
          </p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Effective Date
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Base Salary
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Bonus
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Total Comp
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Reason
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedHistory.map((entry, index) => (
              <SalaryHistoryRow
                key={entry.id}
                entry={entry}
                currencyCode={currencyCode}
                isLatest={index === 0}
              />
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}