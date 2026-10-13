export interface LoginResponse {
  access_token: string
  email: string
}

export interface SavedApplication {
  id?: string
  email: string
  full_name: string
  date_of_birth: string
  address: string
  employer: string
  job_title: string
  annual_income: number | string
  loan_amount: number | string
  loan_purpose: string
  created_at?: string
}

export interface ApplicationPayload {
  full_name: string
  date_of_birth: string
  address: string
  employer: string
  job_title: string
  annual_income: number
  loan_amount: number
  loan_purpose: string
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data: unknown = await response.json()
    if (data && typeof data === 'object' && 'detail' in data) {
      const detail = (data as { detail: unknown }).detail
      if (typeof detail === 'string') return detail
      if (Array.isArray(detail)) {
        const parts = detail
          .map((item) => {
            if (item && typeof item === 'object' && 'msg' in item) {
              return String((item as { msg: unknown }).msg)
            }
            return null
          })
          .filter(Boolean)
        if (parts.length > 0) return parts.join(' ')
      }
    }
  } catch {
    // Fall through to status-based message.
  }

  if (response.status === 401) return 'Invalid email or password.'
  if (response.status >= 500) return 'Server error. Please try again shortly.'
  return 'Something went wrong. Please try again.'
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  })

  if (!response.ok) {
    throw new ApiError(await readErrorMessage(response), response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export function login(email: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function signup(email: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>('/api/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function createApplication(
  token: string,
  payload: ApplicationPayload,
): Promise<SavedApplication> {
  return request<SavedApplication>('/api/applications', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
}

export function listApplications(token: string): Promise<SavedApplication[]> {
  return request<SavedApplication[]>('/api/applications', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
