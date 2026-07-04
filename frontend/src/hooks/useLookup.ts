import { useQuery } from '@tanstack/react-query'
import { lookupApi } from '@/lib/api-client'

export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: () => lookupApi.getDepartments(),
    staleTime: Infinity,
  })
}

export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: () => lookupApi.getCountries(),
    staleTime: Infinity,
  })
}