import { useEffect, useState } from 'react'
import { listApplications, ApiError, type SavedApplication } from '../api/client'
import { Alert } from '../components/Alert'
import { AppShell } from '../components/AppShell'
import { Button } from '../components/Button'
import { FormSection } from '../components/FormSection'
import { SpotlightCard } from '../components/SpotlightCard'
import { formatCurrency, formatDate } from '../utils/validation'

interface SuccessScreenProps {
  accessToken: string
  onStartNew: () => void
  onLogout: () => void
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-primary/5 py-3 last:border-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-sm font-semibold text-primary-dark sm:text-right">{value}</dd>
    </div>
  )
}

export function SuccessScreen({ accessToken, onStartNew, onLogout }: SuccessScreenProps) {
  const [record, setRecord] = useState<SavedApplication | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')
      try {
        const rows = await listApplications(accessToken)
        if (cancelled) return
        if (!rows.length) {
          setError('No saved application was found for your account.')
          setRecord(null)
          return
        }
        setRecord(rows[0])
      } catch (err) {
        if (cancelled) return
        if (err instanceof ApiError) {
          setError(
            err.status === 401
              ? 'Your session has expired. Please log in again.'
              : err.message,
          )
        } else {
          setError('Unable to load your application. Please try again.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [accessToken])

  const firstName = record?.full_name?.split(' ')[0] || 'there'

  return (
    <AppShell>
      <div className="mb-6 rounded-2xl border border-success/20 bg-success-soft px-5 py-4">
        <div className="flex items-start gap-3">
          <span
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success text-white"
            aria-hidden="true"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <div>
            <p className="font-semibold text-success">Application submitted</p>
            <p className="mt-1 text-sm text-muted">
              Thanks, {firstName}. We have received your details and will be in touch shortly.
            </p>
          </div>
        </div>
      </div>

      <SpotlightCard eyebrow="Application summary" className="mb-6">
        <FormSection
          title="Your application"
          subtitle="Loaded from your saved application record."
          className="!border-0 !bg-transparent !p-0 !shadow-none"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          footer={
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <Button type="button" variant="ghost" onClick={onLogout}>
                Log out
              </Button>
              <Button type="button" onClick={onStartNew} disabled={loading}>
                Start a new application
              </Button>
            </div>
          }
        >
          {loading && (
            <div className="flex items-center gap-3 py-6 text-sm text-muted" role="status">
              <svg
                className="h-5 w-5 animate-spin text-accent"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Loading your saved application…
            </div>
          )}

          {!loading && error && <Alert message={error} />}

          {!loading && record && (
            <dl>
              <SummaryRow label="Email" value={record.email} />
              <SummaryRow label="Full name" value={record.full_name} />
              <SummaryRow label="Date of birth" value={formatDate(String(record.date_of_birth))} />
              <SummaryRow label="Address" value={record.address} />
              <SummaryRow label="Employer" value={record.employer} />
              <SummaryRow label="Job title" value={record.job_title} />
              <SummaryRow
                label="Annual income"
                value={formatCurrency(String(record.annual_income))}
              />
              <SummaryRow
                label="Loan amount"
                value={formatCurrency(String(record.loan_amount))}
              />
              <SummaryRow label="Loan purpose" value={record.loan_purpose || '—'} />
            </dl>
          )}
        </FormSection>
      </SpotlightCard>
    </AppShell>
  )
}
