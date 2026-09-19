import { Check } from 'lucide-react'
import type { WelfareApplication } from '../../types'

type StageState = 'done' | 'current' | 'upcoming'

interface Stage {
  label: string
  state: StageState
}

function buildStages(application: WelfareApplication): Stage[] {
  const isDraft = application.status === 'draft'
  const submitted = !isDraft
  const decided = application.status === 'approved' || application.status === 'rejected'
  const inOfficerReview =
    application.status === 'officer-review' ||
    application.status === 'information-requested' ||
    decided

  const stages: Stage[] = [
    { label: 'Application started', state: 'done' },
    {
      label: 'Information completed',
      state: application.currentStepIndex >= 3 || submitted ? 'done' : isDraft ? 'current' : 'upcoming',
    },
    {
      label: 'Documents submitted',
      state: application.documents.length > 0 ? 'done' : submitted ? 'done' : 'upcoming',
    },
    {
      label: 'Declaration accepted',
      state: application.declarationAccepted ? 'done' : 'upcoming',
    },
    {
      label: 'Application submitted',
      state: submitted ? 'done' : 'upcoming',
    },
    {
      label: 'Eligibility assessment',
      state: application.eligibilityResult ? 'done' : submitted ? 'current' : 'upcoming',
    },
    {
      label: 'Officer review',
      state: decided ? 'done' : inOfficerReview ? 'current' : 'upcoming',
    },
    {
      label: 'Decision',
      state: decided ? 'done' : 'upcoming',
    },
    {
      label: 'Payment',
      state: application.status === 'approved' ? 'current' : 'upcoming',
    },
  ]

  // Only one "current" stage: the first upcoming-adjacent one after the last done.
  let currentAssigned = false
  return stages.map((stage) => {
    if (stage.state === 'current') {
      if (currentAssigned) return { ...stage, state: 'upcoming' as StageState }
      currentAssigned = true
      return stage
    }
    return stage
  })
}

export function StatusTimeline({ application }: { application: WelfareApplication }) {
  const stages = buildStages(application)

  return (
    <ol className="space-y-3">
      {stages.map((stage) => (
        <li key={stage.label} className="flex items-center gap-3">
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${
              stage.state === 'done'
                ? 'border-accent-500 bg-accent-500 text-white'
                : stage.state === 'current'
                  ? 'border-navy-900 bg-navy-900 text-white'
                  : 'border-slate-300 bg-white'
            }`}
            aria-hidden="true"
          >
            {stage.state === 'done' && <Check className="h-3 w-3" />}
            {stage.state === 'current' && <span className="h-2 w-2 rounded-full bg-white" />}
          </span>
          <span
            className={`text-sm ${
              stage.state === 'upcoming' ? 'text-slate-400' : 'font-medium text-slate-900'
            }`}
          >
            {stage.label}
          </span>
        </li>
      ))}
    </ol>
  )
}
