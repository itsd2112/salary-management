import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  Users,
  DollarSign,
  TrendingUp,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import {
  useAnalyticsSummary,
  useAnalyticsByDepartment,
  useAnalyticsByCountry,
  useAnalyticsDistribution,
  useTopPaid,
} from '@/hooks/useAnalytics'

// ─── Helpers ──────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B`
  }
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

// ─── Summary Card ─────────────────────────────────────────────

function SummaryCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string
  value: string
  icon: React.ElementType
  color: string
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

// ─── Section Header ───────────────────────────────────────────

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  )
}

// ─── Loading State ────────────────────────────────────────────

function ChartSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="h-4 w-32 bg-gray-100 rounded mb-6" />
      <div className="h-48 bg-gray-50 rounded animate-pulse" />
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────

export default function DashboardPage() {
  const { data: summaryData, isLoading: summaryLoading } = useAnalyticsSummary()
  const { data: deptData, isLoading: deptLoading } = useAnalyticsByDepartment()
  const { data: countryData, isLoading: countryLoading } = useAnalyticsByCountry()
  const { data: distData, isLoading: distLoading } = useAnalyticsDistribution()
  const { data: topPaidData, isLoading: topPaidLoading } = useTopPaid()

  const summary = summaryData?.data
  const departments = deptData?.data ?? []
  const countries = countryData?.data ?? []
  const distribution = distData?.data ?? []
  const topPaid = topPaidData?.data ?? []

  return (
    <div className="p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Organisation-wide payroll overview
        </p>
      </div>

      {/* Summary Cards */}
      {summaryLoading ? (
        <div className="grid grid-cols-5 gap-4 mb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-lg p-6 h-32 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-4 mb-8">
          <SummaryCard
            title="Total Employees"
            value={formatNumber(summary?.totalEmployees ?? 0)}
            icon={Users}
            color="bg-blue-500"
          />
          <SummaryCard
            title="Total Payroll"
            value={formatCurrency(summary?.totalPayroll ?? 0)}
            icon={DollarSign}
            color="bg-green-500"
          />
          <SummaryCard
            title="Average Salary"
            value={formatCurrency(summary?.averageSalary ?? 0)}
            icon={TrendingUp}
            color="bg-purple-500"
          />
          <SummaryCard
            title="Highest Salary"
            value={formatCurrency(summary?.highestSalary ?? 0)}
            icon={ArrowUp}
            color="bg-orange-500"
          />
          <SummaryCard
            title="Lowest Salary"
            value={formatCurrency(summary?.lowestSalary ?? 0)}
            icon={ArrowDown}
            color="bg-gray-500"
          />
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6 mb-6">

        {/* Payroll by Department */}
        {deptLoading ? <ChartSkeleton /> : (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <SectionHeader
              title="Payroll by Department"
              subtitle="Total base salary per department"
            />
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={departments}
                layout="vertical"
                margin={{ left: 80, right: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  tickFormatter={(v) => `$${(v / 1_000_000).toFixed(0)}M`}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  type="category"
                  dataKey="department"
                  tick={{ fontSize: 11 }}
                  width={80}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value)), 'Total Payroll']}
                />
                <Bar dataKey="totalPayroll" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Payroll by Country */}
        {countryLoading ? <ChartSkeleton /> : (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <SectionHeader
              title="Headcount by Country"
              subtitle="Number of employees per country"
            />
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={countries}
                layout="vertical"
                margin={{ left: 100, right: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  type="category"
                  dataKey="country"
                  tick={{ fontSize: 11 }}
                  width={100}
                />
                <Tooltip
                  formatter={(value) => [formatNumber(Number(value)), 'Employees']}
                />
                <Bar dataKey="employeeCount" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

      </div>

      {/* Distribution + Top Paid Row */}
      <div className="grid grid-cols-2 gap-6">

        {/* Salary Distribution */}
        {distLoading ? <ChartSkeleton /> : (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <SectionHeader
              title="Salary Distribution"
              subtitle="Number of employees per salary band"
            />
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={distribution} margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="band"
                  tick={{ fontSize: 10 }}
                  angle={-30}
                  textAnchor="end"
                  height={50}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => [formatNumber(Number(value)), 'Employees']}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Top Paid Employees */}
        {topPaidLoading ? <ChartSkeleton /> : (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <SectionHeader
              title="Top 10 Highest Paid"
              subtitle="Active employees by base salary"
            />
            <div className="space-y-2 mt-2">
              {topPaid.slice(0, 10).map((emp, index) => (
                <div
                  key={emp.id}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-gray-400 w-5">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {emp.firstName} {emp.lastName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {emp.department} · {emp.country}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(emp.baseSalary)}
                    </p>
                    <p className="text-xs text-gray-400">
                      +{formatCurrency(emp.bonus)} bonus
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
