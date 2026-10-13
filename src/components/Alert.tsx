interface AlertProps {
  message: string
  variant?: 'error' | 'info'
}

export function Alert({ message, variant = 'error' }: AlertProps) {
  const styles =
    variant === 'error'
      ? 'border-danger/20 bg-danger-soft text-danger'
      : 'border-primary/10 bg-accent-soft text-primary-dark'

  return (
    <div
      role="alert"
      className={`rounded-xl border px-4 py-3 text-sm font-medium ${styles}`}
    >
      {message}
    </div>
  )
}
