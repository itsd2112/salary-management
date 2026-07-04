import { useQuery } from '@tanstack/react-query'
import { employeeApi } from '@/lib/api-client'
import type { EmployeeFilters } from '@/types'

export function useEmployees(filters: EmployeeFilters = {}) {
  return useQuery({
    queryKey: ['employees', filters],
    queryFn: () => employeeApi.getAll(filters),
  })
}

export function useEmployee(id: number) {
  return useQuery({
    queryKey: ['employees', id],
    queryFn: () => employeeApi.getById(id),
    enabled: !!id, // only fetch if id exists
  })
}
