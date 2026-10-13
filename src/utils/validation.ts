import type { ApplicationData, LoanPurpose } from '../types'

export type FieldErrors = Partial<Record<keyof ApplicationData, string>>

function isPositiveNumber(value: string): boolean {
  const num = Number(value)
  return value.trim() !== '' && !Number.isNaN(num) && num > 0
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function parseDateOnly(value: string): Date | null {
  if (!DATE_PATTERN.test(value)) return null
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }
  return date
}

function isAtLeast18(date: Date): boolean {
  const now = new Date()
  const eighteenthBirthday = new Date(
    now.getFullYear() - 18,
    now.getMonth(),
    now.getDate(),
  )
  return date <= eighteenthBirthday
}

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim())
}

export function validateLogin(data: ApplicationData): FieldErrors {
  const errors: FieldErrors = {}
  if (!data.email.trim()) errors.email = 'Email is required.'
  if (!data.password.trim()) errors.password = 'Password is required.'
  return errors
}

export type SignupFieldErrors = {
  email?: string
  password?: string
  confirmPassword?: string
}

export function validateSignup(
  email: string,
  password: string,
  confirmPassword: string,
): SignupFieldErrors {
  const errors: SignupFieldErrors = {}

  if (!email.trim()) {
    errors.email = 'Email is required.'
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!password) {
    errors.password = 'Password is required.'
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters.'
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.'
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.'
  }

  return errors
}

export function validatePersonal(data: ApplicationData): FieldErrors {
  const errors: FieldErrors = {}
  if (!data.fullName.trim()) errors.fullName = 'Full name is required.'
  if (!data.dateOfBirth.trim()) {
    errors.dateOfBirth = 'Date of birth is required.'
  } else {
    const dob = parseDateOnly(data.dateOfBirth)
    if (!dob) {
      errors.dateOfBirth = 'Please enter a valid date of birth.'
    } else if (dob > new Date()) {
      errors.dateOfBirth = 'Date of birth cannot be in the future.'
    } else if (!isAtLeast18(dob)) {
      errors.dateOfBirth = 'You must be at least 18 years old to apply.'
    }
  }
  if (!data.address.trim()) errors.address = 'Address is required.'
  return errors
}

export function validateEmployment(data: ApplicationData): FieldErrors {
  const errors: FieldErrors = {}
  if (!data.employer.trim()) errors.employer = 'Employer is required.'
  if (!data.jobTitle.trim()) errors.jobTitle = 'Job title is required.'
  if (!data.annualIncome.trim()) {
    errors.annualIncome = 'Annual income is required.'
  } else if (!isPositiveNumber(data.annualIncome)) {
    errors.annualIncome = 'Annual income must be a positive number.'
  }
  return errors
}

export function validateFinancial(data: ApplicationData): FieldErrors {
  const errors: FieldErrors = {}
  if (!data.loanAmount.trim()) {
    errors.loanAmount = 'Loan amount is required.'
  } else if (!isPositiveNumber(data.loanAmount)) {
    errors.loanAmount = 'Loan amount must be a positive number.'
  }
  if (!data.loanPurpose) {
    errors.loanPurpose = 'Please select a loan purpose.'
  }
  return errors
}

export function formatCurrency(value: string): string {
  const num = Number(value)
  if (Number.isNaN(num)) return value
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(num)
}

export function formatDate(value: string): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function isLoanPurpose(value: string): value is Exclude<LoanPurpose, ''> {
  return ['Home', 'Car', 'Education', 'Personal', 'Business'].includes(value)
}
