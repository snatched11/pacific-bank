import { useState, type FormEvent } from 'react'
import { Button } from '../components/Button'
import { FormInput } from '../components/FormInput'
import { FormSection } from '../components/FormSection'
import { StepProgress } from '../components/StepProgress'
import { AppShell } from '../components/AppShell'
import type { ApplicationData } from '../types'
import { validatePersonal, type FieldErrors } from '../utils/validation'

interface PersonalDetailsScreenProps {
  data: ApplicationData
  onChange: (updates: Partial<ApplicationData>) => void
  onBack: () => void
  onContinue: () => void
}

export function PersonalDetailsScreen({
  data,
  onChange,
  onBack,
  onContinue,
}: PersonalDetailsScreenProps) {
  const [errors, setErrors] = useState<FieldErrors>({})

  function clearError(field: keyof ApplicationData) {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const nextErrors = validatePersonal(data)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) onContinue()
  }

  return (
    <AppShell>
      <StepProgress currentStep={1} label="Personal Details" />

      <FormSection
        title="Personal Details"
        subtitle="Tell us a little about yourself so we can personalise your application."
        icon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 1115 0v.75h-15v-.75z"
            />
          </svg>
        }
        footer={
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button type="button" variant="secondary" onClick={onBack}>
              Back
            </Button>
            <Button type="submit" form="personal-form">
              Continue
            </Button>
          </div>
        }
      >
        <form id="personal-form" onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormInput
              id="fullName"
              name="fullName"
              label="Full name"
              autoComplete="name"
              placeholder="Alex Morgan"
              value={data.fullName}
              error={errors.fullName}
              onChange={(e) => {
                onChange({ fullName: e.target.value })
                clearError('fullName')
              }}
            />
            <FormInput
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              label="Date of birth"
              autoComplete="bday"
              value={data.dateOfBirth}
              error={errors.dateOfBirth}
              onChange={(e) => {
                onChange({ dateOfBirth: e.target.value })
                clearError('dateOfBirth')
              }}
            />
            <div className="md:col-span-2">
              <FormInput
                id="address"
                name="address"
                label="Address"
                autoComplete="street-address"
                placeholder="12 Harbour Street, Sydney NSW 2000"
                hint="Include street, suburb, state and postcode."
                value={data.address}
                error={errors.address}
                onChange={(e) => {
                  onChange({ address: e.target.value })
                  clearError('address')
                }}
              />
            </div>
          </div>
        </form>
      </FormSection>
    </AppShell>
  )
}
