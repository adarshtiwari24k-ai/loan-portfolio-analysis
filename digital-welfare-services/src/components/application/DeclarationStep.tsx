import { formatDate } from '../../lib/format'

interface DeclarationStepProps {
  applicantName: string
  accepted: boolean
  acceptedAt?: string
  onChange: (accepted: boolean) => void
  error?: string
}

export function DeclarationStep({ applicantName, accepted, acceptedAt, onChange, error }: DeclarationStepProps) {
  const errorId = 'declaration-error'

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Applicant name</dt>
            <dd className="mt-0.5 font-medium text-slate-900">{applicantName || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Date</dt>
            <dd className="mt-0.5 font-medium text-slate-900">{formatDate(new Date().toISOString())}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Digital declaration status</dt>
            <dd className="mt-0.5 font-medium text-slate-900">
              {accepted ? `Accepted${acceptedAt ? ` • ${formatDate(acceptedAt)}` : ''}` : 'Not yet accepted'}
            </dd>
          </div>
        </dl>
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-slate-200 p-4">
        <input
          id="declaration-checkbox"
          type="checkbox"
          checked={accepted}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 h-5 w-5 rounded border-slate-400 text-navy-900 focus:ring-navy-600"
          aria-describedby={error ? errorId : undefined}
          aria-invalid={Boolean(error)}
        />
        <label htmlFor="declaration-checkbox" className="text-[15px] text-slate-800">
          I confirm that the information provided in this application is complete and accurate.
        </label>
      </div>

      {error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
