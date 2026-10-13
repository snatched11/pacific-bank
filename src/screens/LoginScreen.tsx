import { useState, type FormEvent } from 'react'
import { login, signup, ApiError } from '../api/client'
import { Alert } from '../components/Alert'
import { AppShell } from '../components/AppShell'
import { Button } from '../components/Button'
import { FormInput } from '../components/FormInput'
import { FormSection } from '../components/FormSection'
import { SpotlightCard } from '../components/SpotlightCard'
import type { ApplicationData } from '../types'
import {
  validateLogin,
  validateSignup,
  type FieldErrors,
  type SignupFieldErrors,
} from '../utils/validation'

interface LoginScreenProps {
  data: ApplicationData
  onChange: (updates: Partial<ApplicationData>) => void
  onSuccess: (accessToken: string, email: string) => void
}

type AuthMode = 'login' | 'signup'

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
        />
      </svg>
    )
  }

  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  )
}

function PasswordToggle({
  show,
  onToggle,
  labelShow,
  labelHide,
}: {
  show: boolean
  onToggle: () => void
  labelShow: string
  labelHide: string
}) {
  return (
    <div className="mt-2 flex justify-end">
      <Button
        type="button"
        variant="ghost"
        className="!px-2 !py-1 text-xs"
        onClick={onToggle}
        aria-pressed={show}
        aria-label={show ? labelHide : labelShow}
      >
        <EyeIcon open={show} />
        {show ? 'Hide' : 'Show'}
      </Button>
    </div>
  )
}

export function LoginScreen({ data, onChange, onSuccess }: LoginScreenProps) {
  const [mode, setMode] = useState<AuthMode>('login')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loginErrors, setLoginErrors] = useState<FieldErrors>({})
  const [signupErrors, setSignupErrors] = useState<SignupFieldErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')

  function switchMode(next: AuthMode) {
    setMode(next)
    setFormError('')
    setLoginErrors({})
    setSignupErrors({})
    setConfirmPassword('')
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  async function handleLoginSubmit(event: FormEvent) {
    event.preventDefault()
    const nextErrors = validateLogin(data)
    setLoginErrors(nextErrors)
    setFormError('')
    if (Object.keys(nextErrors).length > 0) return

    setLoading(true)
    try {
      const result = await login(data.email.trim(), data.password)
      onSuccess(result.access_token, result.email)
    } catch (error) {
      if (error instanceof ApiError) {
        setFormError(error.message)
      } else {
        setFormError('Unable to sign in. Please check your connection and try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleSignupSubmit(event: FormEvent) {
    event.preventDefault()
    const nextErrors = validateSignup(data.email, data.password, confirmPassword)
    setSignupErrors(nextErrors)
    setFormError('')
    if (Object.keys(nextErrors).length > 0) return

    setLoading(true)
    try {
      const result = await signup(data.email.trim(), data.password)
      onSuccess(result.access_token, result.email)
    } catch (error) {
      if (error instanceof ApiError) {
        setFormError(error.message)
      } else {
        setFormError('Unable to create your account. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppShell compact showBrand={false}>
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-soft">
          <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15c4-8 14-8 18 0" />
            <circle cx="12" cy="9" r="2.5" fill="currentColor" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Pacific Bank</h1>
      </div>

      <SpotlightCard eyebrow="Our promise" className="mb-6 text-center">
        <p className="text-sm text-muted">Fair, transparent finance.</p>
      </SpotlightCard>

      {mode === 'login' ? (
        <FormSection
          title="Welcome back"
          subtitle="Sign in to continue your loan application."
          footer={
            <div className="space-y-4">
              <Button type="submit" form="login-form" className="w-full" loading={loading}>
                Login
              </Button>
              <p className="text-center text-sm text-muted">
                New here?{' '}
                <button
                  type="button"
                  className="font-semibold text-primary transition-colors hover:text-primary-light"
                  onClick={() => switchMode('signup')}
                >
                  Create account
                </button>
              </p>
            </div>
          }
        >
          <form id="login-form" onSubmit={handleLoginSubmit} noValidate className="space-y-5">
            {formError && <Alert message={formError} />}

            <FormInput
              id="email"
              name="email"
              type="email"
              label="Email"
              autoComplete="email"
              placeholder="you@example.com"
              value={data.email}
              error={loginErrors.email}
              onChange={(e) => {
                onChange({ email: e.target.value })
                if (loginErrors.email) setLoginErrors((prev) => ({ ...prev, email: undefined }))
                if (formError) setFormError('')
              }}
            />

            <div>
              <FormInput
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={data.password}
                error={loginErrors.password}
                onChange={(e) => {
                  onChange({ password: e.target.value })
                  if (loginErrors.password) {
                    setLoginErrors((prev) => ({ ...prev, password: undefined }))
                  }
                  if (formError) setFormError('')
                }}
              />
              <PasswordToggle
                show={showPassword}
                onToggle={() => setShowPassword((prev) => !prev)}
                labelShow="Show password"
                labelHide="Hide password"
              />
            </div>
          </form>
        </FormSection>
      ) : (
        <FormSection
          title="Create account"
          subtitle="Set up your Pacific Bank login to start an application."
          footer={
            <div className="space-y-4">
              <Button type="submit" form="signup-form" className="w-full" loading={loading}>
                Create account
              </Button>
              <p className="text-center text-sm text-muted">
                Already registered?{' '}
                <button
                  type="button"
                  className="font-semibold text-primary transition-colors hover:text-primary-light"
                  onClick={() => switchMode('login')}
                >
                  Back to login
                </button>
              </p>
            </div>
          }
        >
          <form id="signup-form" onSubmit={handleSignupSubmit} noValidate className="space-y-5">
            {formError && <Alert message={formError} />}

            <FormInput
              id="signup-email"
              name="email"
              type="email"
              label="Email"
              autoComplete="email"
              placeholder="you@example.com"
              value={data.email}
              error={signupErrors.email}
              onChange={(e) => {
                onChange({ email: e.target.value })
                if (signupErrors.email) setSignupErrors((prev) => ({ ...prev, email: undefined }))
                if (formError) setFormError('')
              }}
            />

            <div>
              <FormInput
                id="signup-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                hint="Use at least 8 characters."
                value={data.password}
                error={signupErrors.password}
                onChange={(e) => {
                  onChange({ password: e.target.value })
                  if (signupErrors.password) {
                    setSignupErrors((prev) => ({ ...prev, password: undefined }))
                  }
                  if (formError) setFormError('')
                }}
              />
              <PasswordToggle
                show={showPassword}
                onToggle={() => setShowPassword((prev) => !prev)}
                labelShow="Show password"
                labelHide="Hide password"
              />
            </div>

            <div>
              <FormInput
                id="confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                label="Confirm password"
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                error={signupErrors.confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  if (signupErrors.confirmPassword) {
                    setSignupErrors((prev) => ({ ...prev, confirmPassword: undefined }))
                  }
                  if (formError) setFormError('')
                }}
              />
              <PasswordToggle
                show={showConfirmPassword}
                onToggle={() => setShowConfirmPassword((prev) => !prev)}
                labelShow="Show confirm password"
                labelHide="Hide confirm password"
              />
            </div>
          </form>
        </FormSection>
      )}
    </AppShell>
  )
}
