export const DEPARTMENTS = [
  'Engineering',
  'Finance',
  'HR',
  'Sales',
  'Marketing',
  'Operations',
  'Legal',
  'Product',
] as const

export const COUNTRIES = [
  { name: 'United States', currencyCode: 'USD' },
  { name: 'India', currencyCode: 'INR' },
  { name: 'United Kingdom', currencyCode: 'GBP' },
  { name: 'Germany', currencyCode: 'EUR' },
  { name: 'Canada', currencyCode: 'CAD' },
  { name: 'Australia', currencyCode: 'AUD' },
] as const

export const JOB_LEVELS = [
  'JUNIOR',
  'MID',
  'SENIOR',
  'LEAD',
  'MANAGER',
  'DIRECTOR',
] as const

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 25,
  MAX_PAGE_SIZE: 100,
} as const

export const SALARY_REASONS = [
  'NEW_HIRE',
  'RAISE',
  'PROMOTION',
  'CORRECTION',
] as const