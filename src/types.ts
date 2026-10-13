export type AppStep =
  | 'login'
  | 'personal'
  | 'employment'
  | 'financial'
  | 'success'

export type LoanPurpose = 'Home' | 'Car' | 'Education' | 'Personal' | 'Business' | ''

export interface ApplicationData {
  email: string
  password: string
  fullName: string
  dateOfBirth: string
  address: string
  employer: string
  jobTitle: string
  annualIncome: string
  loanAmount: string
  loanPurpose: LoanPurpose
}

export const initialApplicationData: ApplicationData = {
  email: '',
  password: '',
  fullName: '',
  dateOfBirth: '',
  address: '',
  employer: '',
  jobTitle: '',
  annualIncome: '',
  loanAmount: '',
  loanPurpose: '',
}

export const LOAN_PURPOSES: Exclude<LoanPurpose, ''>[] = [
  'Home',
  'Car',
  'Education',
  'Personal',
  'Business',
]

export const FORM_STEPS = [
  { id: 'personal', label: 'Personal Details', stepNumber: 1 },
  { id: 'employment', label: 'Employment Details', stepNumber: 2 },
  { id: 'financial', label: 'Financial Information', stepNumber: 3 },
] as const
