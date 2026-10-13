interface StepProgressProps {
  currentStep: number
  totalSteps?: number
  label: string
}

export function StepProgress({
  currentStep,
  totalSteps = 3,
  label,
}: StepProgressProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="mb-6" aria-label={`Progress: step ${currentStep} of ${totalSteps}`}>
      <div className="mb-2 flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-muted">
          Step {currentStep} of {totalSteps}
        </p>
        <p className="text-sm font-semibold text-primary">{label}</p>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-primary/10"
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
      >
        <div
          className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
