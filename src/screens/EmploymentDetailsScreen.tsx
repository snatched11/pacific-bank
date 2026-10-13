import { useState, type FormEvent } from 'react'
import { Button } from '../components/Button'
import { FormInput } from '../components/FormInput'
import { FormSection } from '../components/FormSection'
import { StepProgress } from '../components/StepProgress'
import { AppShell } from '../components/AppShell'
import type { ApplicationData } from '../types'
import { validateEmployment, type FieldErrors } from '../utils/validation'

interface EmploymentDetailsScreenProps {
  data: ApplicationData
  onChange: (updates: Partial<ApplicationData>) => void
  onBack: () => void
  onContinue: () => void
}

export function EmploymentDetailsScreen({
  data,
  onChange,
  onBack,
  onContinue,
}: EmploymentDetailsScreenProps) {
  const [errors, setErrors] = useState<FieldErrors>({})

  function clearError(field: keyof ApplicationData) {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const nextErrors = validateEmployment(data)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) onContinue()
  }

  return (
    <AppShell>
      <StepProgress currentStep={2} label="Employment Details" />

      <FormSection
        title="Employment Details"
        subtitle="Your income helps us assess a loan that fits your situation."
        icon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M20.25 14.15v4.07a2.25 2.25 0 01-2.25 2.25H5.75a2.25 2.25 0 01-2.25-2.25v-4.07m16.5 0a2.25 2.25 0 00.63-1.58V7.5A2.25 2.25 0 0020.25 5.25H3.75A2.25 2.25 0 001.5 7.5v5.07c0 .58.22 1.13.63 1.58m16.5 0a48.6 48.6 0 01-16.5 0m16.5 0a48.47 48.47 0 01-8.25 0"
            />
          </svg>
        }
        footer={
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button type="button" variant="secondary" onClick={onBack}>
              Back
            </Button>
            <Button type="submit" form="employment-form">
              Continue
            </Button>
          </div>
        }
      >
        <form id="employment-form" onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormInput
              id="employer"
              name="employer"
              label="Employer"
              autoComplete="organization"
              placeholder="Acme Pty Ltd"
              value={data.employer}
              error={errors.employer}
              onChange={(e) => {
                onChange({ employer: e.target.value })
                clearError('employer')
              }}
            />
            <FormInput
              id="jobTitle"
              name="jobTitle"
              label="Job title"
              autoComplete="organization-title"
              placeholder="Software Engineer"
              value={data.jobTitle}
              error={errors.jobTitle}
              onChange={(e) => {
                onChange({ jobTitle: e.target.value })
                clearError('jobTitle')
              }}
            />
            <div className="md:col-span-2">
              <FormInput
                id="annualIncome"
                name="annualIncome"
                type="number"
                inputMode="decimal"
                min="1"
                step="1"
                label="Annual income"
                placeholder="85000"
                hint="Enter your gross annual income in AUD."
                value={data.annualIncome}
                error={errors.annualIncome}
                onChange={(e) => {
                  onChange({ annualIncome: e.target.value })
                  clearError('annualIncome')
                }}
              />
            </div>
          </div>
        </form>
      </FormSection>
    </AppShell>
  )
}
