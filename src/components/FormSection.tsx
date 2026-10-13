import type { ReactNode } from 'react'

interface FormSectionProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  children: ReactNode
  className?: string
  footer?: ReactNode
}

export function FormSection({
  title,
  subtitle,
  icon,
  children,
  className = '',
  footer,
}: FormSectionProps) {
  return (
    <section
      className={`
        rounded-2xl border border-primary/5 bg-surface-card p-6 shadow-card
        sm:p-8
        ${className}
      `}
    >
      <header className="mb-6">
        <div className="flex items-center gap-3">
          {icon && (
            <span
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-primary"
            >
              {icon}
            </span>
          )}
          <h1 className="text-2xl font-bold tracking-tight text-primary-dark">
            {title}
          </h1>
        </div>
        {subtitle && (
          <p className="mt-2 text-sm leading-relaxed text-muted">{subtitle}</p>
        )}
      </header>

      <div className="space-y-5">{children}</div>

      {footer && <div className="mt-8">{footer}</div>}
    </section>
  )
}
