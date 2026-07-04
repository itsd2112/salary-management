import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useDepartments, useCountries } from '@/hooks/useLookup'
import { employeeApi } from '@/lib/api-client'
import type { CreateEmployeeInput, JobLevel, SalaryReason } from '@/types'

// ─── Initial Form State ───────────────────────────────────────

const initialForm: CreateEmployeeInput = {
  firstName: '',
  lastName: '',
  email: '',
  departmentId: 0,
  countryId: 0,
  jobLevel: '' as JobLevel,
  hireDate: '',
  salary: {
    baseSalary: 0,
    bonus: 0,
    effectiveDate: '',
    reason: 'NEW_HIRE' as SalaryReason,
  },
}

// ─── Page ─────────────────────────────────────────────────────

export default function NewEmployeePage() {
  const navigate = useNavigate()

  const { data: departmentsData } = useDepartments()
  const { data: countriesData } = useCountries()

  const departments = departmentsData?.data ?? []
  const countries = countriesData?.data ?? []

  const [form, setForm] = useState<CreateEmployeeInput>(initialForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')

  // ─── Handlers ───────────────────────────────────────────────

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target

    // Handle nested salary fields
    if (name.startsWith('salary.')) {
      const salaryField = name.replace('salary.', '')
      setForm(prev => ({
        ...prev,
        salary: {
          ...prev.salary,
          [salaryField]:
            salaryField === 'baseSalary' || salaryField === 'bonus'
              ? parseFloat(value) || 0
              : value,
        },
      }))
    } else {
      setForm(prev => ({
        ...prev,
        [name]:
          name === 'departmentId' || name === 'countryId'
            ? parseInt(value, 10)
            : value,
      }))
    }

    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // ─── Validation ──────────────────────────────────────────────

  function validate(): boolean {
    const newErrors: Record<string, string> = {}

    if (!form.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!form.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Invalid email address'
    }
    if (!form.departmentId) newErrors.departmentId = 'Department is required'
    if (!form.countryId) newErrors.countryId = 'Country is required'
    if (!form.jobLevel) newErrors.jobLevel = 'Job level is required'
    if (!form.hireDate) newErrors.hireDate = 'Hire date is required'
    if (!form.salary.baseSalary || form.salary.baseSalary <= 0) {
      newErrors['salary.baseSalary'] = 'Base salary must be greater than 0'
    }
    if (!form.salary.effectiveDate) {
      newErrors['salary.effectiveDate'] = 'Effective date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ─── Submit ──────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError('')

    if (!validate()) return

    setIsSubmitting(true)
    try {
      const response = await employeeApi.create(form)
      navigate(`/employees/${response.data.id}`)
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Failed to create employee'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // ─── Render ──────────────────────────────────────────────────

  return (
    <div className="p-8 max-w-2xl mx-auto">

      {/* Back */}
      <button
        onClick={() => navigate('/employees')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to employees
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Add Employee
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Create a new employee record with initial salary
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Personal Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            Personal Information
          </h2>
          <div className="grid grid-cols-2 gap-4">

            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.firstName && (
                <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.lastName && (
                <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

          </div>
        </div>

        {/* Job Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            Job Information
          </h2>
          <div className="grid grid-cols-2 gap-4">

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                name="departmentId"
                value={form.departmentId || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select department</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              {errors.departmentId && (
                <p className="text-xs text-red-500 mt-1">{errors.departmentId}</p>
              )}
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <select
                name="countryId"
                value={form.countryId || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select country</option>
                {countries.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.currencyCode})
                  </option>
                ))}
              </select>
              {errors.countryId && (
                <p className="text-xs text-red-500 mt-1">{errors.countryId}</p>
              )}
            </div>

            {/* Job Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Level
              </label>
              <select
                name="jobLevel"
                value={form.jobLevel}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select level</option>
                <option value="JUNIOR">Junior</option>
                <option value="MID">Mid</option>
                <option value="SENIOR">Senior</option>
                <option value="LEAD">Lead</option>
                <option value="MANAGER">Manager</option>
                <option value="DIRECTOR">Director</option>
              </select>
              {errors.jobLevel && (
                <p className="text-xs text-red-500 mt-1">{errors.jobLevel}</p>
              )}
            </div>

            {/* Hire Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hire Date
              </label>
              <input
                type="date"
                name="hireDate"
                value={form.hireDate}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.hireDate && (
                <p className="text-xs text-red-500 mt-1">{errors.hireDate}</p>
              )}
            </div>

          </div>
        </div>

        {/* Initial Salary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            Initial Salary
          </h2>
          <div className="grid grid-cols-2 gap-4">

            {/* Base Salary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base Salary
              </label>
              <input
                type="number"
                name="salary.baseSalary"
                value={form.salary.baseSalary || ''}
                onChange={handleChange}
                min={0}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors['salary.baseSalary'] && (
                <p className="text-xs text-red-500 mt-1">
                  {errors['salary.baseSalary']}
                </p>
              )}
            </div>

            {/* Bonus */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bonus (optional)
              </label>
              <input
                type="number"
                name="salary.bonus"
                value={form.salary.bonus || ''}
                onChange={handleChange}
                min={0}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Effective Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Effective Date
              </label>
              <input
                type="date"
                name="salary.effectiveDate"
                value={form.salary.effectiveDate}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors['salary.effectiveDate'] && (
                <p className="text-xs text-red-500 mt-1">
                  {errors['salary.effectiveDate']}
                </p>
              )}
            </div>

          </div>
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3">
            <p className="text-sm text-red-600">{serverError}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Creating...' : 'Create Employee'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/employees')}
            className="flex-1 px-4 py-2 border border-gray-200 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  )
}