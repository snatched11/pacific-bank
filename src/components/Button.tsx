import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  loading?: boolean
  children: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-dark shadow-soft disabled:bg-primary/50',
  secondary:
    'bg-white text-primary border border-primary/20 hover:bg-accent-soft disabled:text-muted-light disabled:border-muted-light/40',
  ghost:
    'bg-transparent text-primary hover:bg-accent-soft disabled:text-muted-light',
}

export function Button({
  variant = 'primary',
  loading = false,
  disabled,
  children,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5
        text-sm font-semibold transition-all duration-200
        disabled:cursor-not-allowed disabled:opacity-70
        ${variantClasses[variant]}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <svg
          className="h-4 w-4 animate-spin"
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
      )}
      {children}
    </button>
  )
}
