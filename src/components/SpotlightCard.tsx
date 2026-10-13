import {
  useCallback,
  useRef,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from 'react'

interface SpotlightCardProps {
  children: ReactNode
  eyebrow?: string
  className?: string
  glowColor?: string
}

export function SpotlightCard({
  children,
  eyebrow,
  className = '',
  glowColor = 'rgba(27, 154, 170, 0.28)',
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handlePointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const bounds = card.getBoundingClientRect()
    card.style.setProperty('--spotlight-x', `${event.clientX - bounds.left}px`)
    card.style.setProperty('--spotlight-y', `${event.clientY - bounds.top}px`)
  }, [])

  const handlePointerLeave = useCallback(() => {
    const card = cardRef.current
    if (!card) return
    card.style.removeProperty('--spotlight-x')
    card.style.removeProperty('--spotlight-y')
  }, [])

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`
        group relative overflow-hidden rounded-2xl border border-primary/10
        bg-surface-card p-6 shadow-card sm:p-8
        ${className}
      `}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"
        style={
          {
            background: `radial-gradient(280px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), ${glowColor}, transparent 70%)`,
          } as CSSProperties
        }
      />

      <div className="relative">
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">
            {eyebrow}
          </p>
        )}
        {children}
      </div>
    </div>
  )
}
