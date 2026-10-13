import type { InputHTMLAttributes, ReactNode } from 'react'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
  error?: string
  icon?: ReactNode
}

export function FormInput({
  id,
  label,
  hint,
  error,
  icon,
  className = '',
  ...props
}: FormInputProps) {
  const inputId = id ?? props.name
  const hintId = hint ? `${inputId}-hint` : undefined
  const errorId = error ? `${inputId}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-sm font-medium text-primary-dark"
      >
        {label}
      </label>

      <div className="relative">
        {icon && (
          <span
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-light"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`
            w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-primary-dark
            placeholder:text-muted-light transition-colors duration-200
            ${icon ? 'pl-10' : ''}
            ${
              error
                ? 'border-danger focus:border-danger focus:ring-danger/30'
                : 'border-primary/15 hover:border-primary/30 focus:border-accent'
            }
            ${className}
          `}
          {...props}
        />
      </div>

      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-muted-light">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
