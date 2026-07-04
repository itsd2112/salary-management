import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { employeeApi } from '@/lib/api-client'
import type { EmployeeFilters, AddSalaryInput } from '@/types'

export function useEmployees(filters: EmployeeFilters = {}) {
  return useQuery({
    queryKey: ['employees', filters],
    queryFn: () => employeeApi.getAll(filters),
  })
}

export function useEmployee(id: number) {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: () => employeeApi.getById(id),
    enabled: !!id,
  })
}

export function useDeactivateEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => employeeApi.deactivate(id),
    onSuccess: (_, id) => {
      // Invalidate cache so detail page refetches
      queryClient.invalidateQueries({ queryKey: ['employee', id] })
      queryClient.invalidateQueries({ queryKey: ['employees'] })
    },
  })
}

export function useAddSalary() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AddSalaryInput }) =>
      employeeApi.addSalary(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['employee', id] })
    },
  })
}