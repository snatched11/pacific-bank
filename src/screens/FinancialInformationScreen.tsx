import { useState, type FormEvent } from 'react'
import { createApplication, ApiError } from '../api/client'
import { Alert } from '../components/Alert'
import { AppShell } from '../components/AppShell'
import { Button } from '../components/Button'
import { FormInput } from '../components/FormInput'
import { FormSection } from '../components/FormSection'
import { StepProgress } from '../components/StepProgress'
import { LOAN_PURPOSES, type ApplicationData } from '../types'
import {
  isLoanPurpose,
  validateFinancial,
  type FieldErrors,
} from '../utils/validation'

interface FinancialInformationScreenProps {
  data: ApplicationData
  accessToken: string
  onChange: (updates: Partial<ApplicationData>) => void
  onBack: () => void
  onContinue: () => void
}

export function FinancialInformationScreen({
  data,
  accessToken,
  onChange,
  onBack,
  onContinue,
}: FinancialInformationScreenProps) {
  const [errors, setErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')

  function clearError(field: keyof ApplicationData) {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const nextErrors = validateFinancial(data)
    setErrors(nextErrors)
    setFormError('')
    if (Object.keys(nextErrors).length > 0) return

    setLoading(true)
    try {
      await createApplication(accessToken, {
        full_name: data.fullName.trim(),
        date_of_birth: data.dateOfBirth,
        address: data.address.trim(),
        employer: data.employer.trim(),
        job_title: data.jobTitle.trim(),
        annual_income: Number(data.annualIncome),
        loan_amount: Number(data.loanAmount),
        loan_purpose: data.loanPurpose,
      })
      onContinue()
    } catch (error) {
      if (error instanceof ApiError) {
        setFormError(
          error.status === 401
            ? 'Your session has expired. Please log in again.'
            : error.message,
        )
      } else {
        setFormError('Unable to submit your application. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppShell>
      <StepProgress currentStep={3} label="Financial Information" />

      <FormSection
        title="Financial Information"
        subtitle="Almost there — tell us how much you need and what it is for."
        footer={
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button type="button" variant="secondary" onClick={onBack} disabled={loading}>
              Back
            </Button>
            <Button type="submit" form="financial-form" loading={loading}>
              Submit application
            </Button>
          </div>
        }
      >
        <form id="financial-form" onSubmit={handleSubmit} noValidate className="space-y-5">
          {formError && <Alert message={formError} />}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormInput
              id="loanAmount"
              name="loanAmount"
              type="number"
              inputMode="decimal"
              min="1"
              step="1"
              label="Loan amount"
              placeholder="25000"
              hint="Amount you wish to borrow in AUD."
              value={data.loanAmount}
              error={errors.loanAmount}
              onChange={(e) => {
                onChange({ loanAmount: e.target.value })
                clearError('loanAmount')
                if (formError) setFormError('')
              }}
            />

            <div className="w-full">
              <label
                htmlFor="loanPurpose"
                className="mb-1.5 block text-sm font-medium text-primary-dark"
              >
                Loan purpose
              </label>
              <select
                id="loanPurpose"
                name="loanPurpose"
                value={data.loanPurpose}
                aria-invalid={errors.loanPurpose ? true : undefined}
                aria-describedby={errors.loanPurpose ? 'loanPurpose-error' : undefined}
                onChange={(e) => {
                  const value = e.target.value
                  onChange({
                    loanPurpose: isLoanPurpose(value) ? value : '',
                  })
                  clearError('loanPurpose')
                  if (formError) setFormError('')
                }}
                className={`
                  w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-primary-dark
                  transition-colors duration-200
                  ${
                    errors.loanPurpose
                      ? 'border-danger focus:border-danger'
                      : 'border-primary/15 hover:border-primary/30 focus:border-accent'
                  }
                `}
              >
                <option value="">Select a purpose</option>
                {LOAN_PURPOSES.map((purpose) => (
                  <option key={purpose} value={purpose}>
                    {purpose}
                  </option>
                ))}
              </select>
              {errors.loanPurpose && (
                <p
                  id="loanPurpose-error"
                  role="alert"
                  className="mt-1.5 text-xs font-medium text-danger"
                >
                  {errors.loanPurpose}
                </p>
              )}
            </div>
          </div>
        </form>
      </FormSection>
    </AppShell>
  )
}
