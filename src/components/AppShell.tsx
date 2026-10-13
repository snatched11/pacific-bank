import type { ReactNode } from 'react'

interface AppShellProps {
  children: ReactNode
  showBrand?: boolean
  compact?: boolean
}

export function AppShell({
  children,
  showBrand = true,
  compact = false,
}: AppShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#E6F6F8_0%,_#F4F7F9_45%,_#EEF2F5_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />

      <div
        className={`
          relative mx-auto flex min-h-screen w-full flex-col px-4 py-8
          ${compact ? 'max-w-md justify-center' : 'max-w-3xl justify-start sm:py-12'}
        `}
      >
        {showBrand && (
          <div className={`mb-6 ${compact ? 'text-center' : ''}`}>
            <p className="text-xl font-bold tracking-tight text-primary">
              Pacific Bank
            </p>
            {!compact && (
              <p className="mt-1 text-sm text-muted">Fair, transparent finance.</p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
