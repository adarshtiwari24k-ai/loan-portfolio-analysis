import { Check } from 'lucide-react'

interface ProgressStepperProps {
  steps: { id: string; title: string }[]
  currentIndex: number
}

export function ProgressStepper({ steps, currentIndex }: ProgressStepperProps) {
  const percentComplete = Math.round((currentIndex / (steps.length - 1)) * 100)

  return (
    <nav aria-label="Application progress">
      <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
        <span>
          Step {Math.min(currentIndex + 1, steps.length)} of {steps.length}: {steps[currentIndex]?.title}
        </span>
        <span>{percentComplete}% complete</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-valuenow={percentComplete} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="h-full rounded-full bg-navy-900 transition-all duration-300"
          style={{ width: `${percentComplete}%` }}
        />
      </div>
      <ol className="mt-3 hidden flex-wrap gap-x-4 gap-y-2 md:flex">
        {steps.map((step, index) => {
          const isComplete = index < currentIndex
          const isCurrent = index === currentIndex
          return (
            <li key={step.id} className="flex items-center gap-1.5 text-xs">
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-semibold ${
                  isComplete
                    ? 'border-accent-500 bg-accent-500 text-white'
                    : isCurrent
                      ? 'border-navy-900 bg-navy-900 text-white'
                      : 'border-slate-300 bg-white text-slate-400'
                }`}
                aria-hidden="true"
              >
                {isComplete ? <Check className="h-3 w-3" /> : index + 1}
              </span>
              <span className={isCurrent ? 'font-medium text-slate-900' : 'text-slate-500'}>
                {step.title}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
