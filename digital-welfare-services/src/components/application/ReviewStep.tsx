import type { ReactNode } from 'react'
import type { ServiceDefinition, WelfareApplication } from '../../types'
import { Card, CardBody, CardHeader } from '../ui/Card'
import { Alert } from '../ui/Alert'
import { DocumentLink } from '../ui/DocumentLink'
import { EligibilityResultPanel } from './EligibilityResultPanel'
import { formatDate, formatFileSize } from '../../lib/format'

interface ReviewStepProps {
  service: ServiceDefinition
  application: WelfareApplication
  answers: Record<string, string>
  onEdit: (stepId: string) => void
}

function ReviewSection({
  title,
  onEdit,
  children,
}: {
  title: string
  onEdit: () => void
  children: ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <h3 className="font-medium text-slate-900">{title}</h3>
        <button type="button" onClick={onEdit} className="text-sm font-medium text-navy-800 hover:underline">
          Edit
        </button>
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  )
}

export function ReviewStep({ service, application, answers, onEdit }: ReviewStepProps) {
  const personalStep = service.steps.find((s) => s.id === 'personal')
  const employmentStep = service.steps.find((s) => s.id === 'employment')
  const eligibilityStep = service.steps.find((s) => s.id === 'eligibility')

  return (
    <div className="space-y-6">
      <Alert tone="info" title="Before you submit">
        Please check that all information is correct.
      </Alert>

      {personalStep?.fields && (
        <ReviewSection title="Personal details" onEdit={() => onEdit('personal')}>
          <dl className="grid gap-3 sm:grid-cols-2">
            {personalStep.fields.map((field) => (
              <div key={field.id}>
                <dt className="text-xs uppercase tracking-wide text-slate-500">{field.label}</dt>
                <dd className="mt-0.5 whitespace-pre-line text-slate-900">{answers[field.id] || '—'}</dd>
              </div>
            ))}
          </dl>
        </ReviewSection>
      )}

      {employmentStep?.fields && (
        <ReviewSection title="Employment & income" onEdit={() => onEdit('employment')}>
          <dl className="grid gap-3 sm:grid-cols-2">
            {employmentStep.fields.map((field) => (
              <div key={field.id}>
                <dt className="text-xs uppercase tracking-wide text-slate-500">{field.label}</dt>
                <dd className="mt-0.5 text-slate-900">
                  {field.type === 'select'
                    ? field.options?.find((o) => o.value === answers[field.id])?.label ?? '—'
                    : answers[field.id] || '—'}
                </dd>
              </div>
            ))}
          </dl>
        </ReviewSection>
      )}

      {eligibilityStep?.fields && (
        <ReviewSection title="Eligibility" onEdit={() => onEdit('eligibility')}>
          <dl className="grid gap-3 sm:grid-cols-2">
            {eligibilityStep.fields.map((field) => (
              <div key={field.id}>
                <dt className="text-xs uppercase tracking-wide text-slate-500">{field.label}</dt>
                <dd className="mt-0.5 text-slate-900">
                  {field.options?.find((o) => o.value === answers[field.id])?.label ?? '—'}
                </dd>
              </div>
            ))}
          </dl>
          {application.eligibilityResult && (
            <div className="mt-4">
              <EligibilityResultPanel result={application.eligibilityResult} />
            </div>
          )}
        </ReviewSection>
      )}

      <ReviewSection title="Documents" onEdit={() => onEdit('documents')}>
        {application.documents.length === 0 ? (
          <p className="text-sm text-slate-500">No documents uploaded yet.</p>
        ) : (
          <ul className="space-y-1.5">
            {application.documents.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between text-sm">
                <DocumentLink document={doc} />
                <span className="text-slate-400">{formatFileSize(doc.fileSize)}</span>
              </li>
            ))}
          </ul>
        )}
      </ReviewSection>

      <ReviewSection title="Declaration" onEdit={() => onEdit('declaration')}>
        <p className="text-sm text-slate-800">
          {application.declarationAccepted
            ? `Accepted by ${application.applicantName} on ${formatDate(application.declarationAcceptedAt)}.`
            : 'Not yet accepted.'}
        </p>
      </ReviewSection>
    </div>
  )
}
