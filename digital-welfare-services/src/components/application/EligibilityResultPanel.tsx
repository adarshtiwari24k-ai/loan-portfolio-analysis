import { AlertCircle, CheckCircle2 } from 'lucide-react'
import type { EligibilityRuleResult } from '../../types'

export function EligibilityResultPanel({ result }: { result: EligibilityRuleResult }) {
  const isPositive = result.outcome === 'potentially-eligible'
  return (
    <div
      className={`rounded-lg border p-5 ${isPositive ? 'border-accent-500/30 bg-accent-100' : 'border-amber-600/30 bg-amber-100'}`}
    >
      <div className="flex items-start gap-3">
        {isPositive ? (
          <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-accent-600" aria-hidden="true" />
        ) : (
          <AlertCircle className="mt-0.5 h-6 w-6 shrink-0 text-amber-600" aria-hidden="true" />
        )}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Initial eligibility assessment
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-900">
            {isPositive ? 'Potentially eligible' : 'Further review required'}
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {result.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-500">
            This is a demonstration assessment from a simplified rules engine. It is not a final
            legal or benefit determination &mdash; every application still receives officer
            attention where needed.
          </p>
        </div>
      </div>
    </div>
  )
}
