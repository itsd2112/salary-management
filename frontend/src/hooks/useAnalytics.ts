import { useQuery } from '@tanstack/react-query'
import { analyticsApi } from '@/lib/api-client'

export function useAnalyticsSummary() {
  return useQuery({
    queryKey: ['analytics', 'summary'],
    queryFn: () => analyticsApi.getSummary(),
  })
}

export function useAnalyticsByDepartment() {
  return useQuery({
    queryKey: ['analytics', 'by-department'],
    queryFn: () => analyticsApi.getByDepartment(),
  })
}

export function useAnalyticsByCountry() {
  return useQuery({
    queryKey: ['analytics', 'by-country'],
    queryFn: () => analyticsApi.getByCountry(),
  })
}

export function useAnalyticsDistribution() {
  return useQuery({
    queryKey: ['analytics', 'distribution'],
    queryFn: () => analyticsApi.getDistribution(),
  })
}

export function useTopPaid() {
  return useQuery({
    queryKey: ['analytics', 'top-paid'],
    queryFn: () => analyticsApi.getTopPaid(10),
  })
}