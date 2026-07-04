import axios from 'axios'
import type {
  Employee,
  EmployeeFilters,
  PaginatedResponse,
  ApiResponse,
  Department,
  Country,
  AddSalaryInput,
  CreateEmployeeInput
} from '@/types'

// ─── Axios Instance ───────────────────────────────────────────

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Response Interceptor ─────────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error?.message ?? 'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

// ─── Employee Endpoints ───────────────────────────────────────

export const employeeApi = {
  getAll(filters: EmployeeFilters): Promise<PaginatedResponse<Employee>> {
    return api
      .get('/employees', { params: filters })
      .then((res) => res.data)
  },

  getById(id: number): Promise<ApiResponse<Employee>> {
    return api
      .get(`/employees/${id}`)
      .then((res) => res.data)
  },

  create(data: CreateEmployeeInput): Promise<ApiResponse<Employee>> {
    return api.post('/employees', data).then((res) => res.data)
  },

  deactivate(id: number): Promise<ApiResponse<Employee>> {
    return api
      .post(`/employees/${id}/deactivate`)
      .then((res) => res.data)
  },

  addSalary(id: number, data: AddSalaryInput): Promise<ApiResponse<Employee>> {
    return api
      .post(`/employees/${id}/salary`, data)
      .then((res) => res.data)
  },
}

// ─── Lookup Endpoints ─────────────────────────────────────────

export const lookupApi = {
  getDepartments(): Promise<ApiResponse<Department[]>> {
    return api.get('/departments').then((res) => res.data)
  },

  getCountries(): Promise<ApiResponse<Country[]>> {
    return api.get('/countries').then((res) => res.data)
  },
}

export default api