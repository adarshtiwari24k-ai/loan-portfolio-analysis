import { CheckCircle2, XCircle } from 'lucide-react'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'

interface SubmitStepProps {
  checks: { label: string; passed: boolean }[]
  onSubmit: () => void
  isSubmitting: boolean
}

export function SubmitStep({ checks, onSubmit, isSubmitting }: SubmitStepProps) {
  const allPassed = checks.every((check) => check.passed)

  return (
    <div className="space-y-6">
      <ul className="space-y-2 rounded-lg border border-slate-200 p-4">
        {checks.map((check) => (
          <li key={check.label} className="flex items-center gap-2 text-sm">
            {check.passed ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-accent-600" aria-hidden="true" />
            ) : (
              <XCircle className="h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
            )}
            <span className={check.passed ? 'text-slate-800' : 'font-medium text-red-700'}>
              {check.label}
            </span>
          </li>
        ))}
      </ul>

      {allPassed ? (
        <Alert tone="success" title="Ready to submit">
          All checks have passed. Submitting will send your application for eligibility assessment and
          processing.
        </Alert>
      ) : (
        <Alert tone="warning" title="Not ready to submit">
          Please resolve the items above before submitting. Use the Back button or Review step to make
          changes.
        </Alert>
      )}

      <Button size="lg" onClick={onSubmit} loading={isSubmitting} disabled={!allPassed}>
        Submit application
      </Button>
    </div>
  )
}
