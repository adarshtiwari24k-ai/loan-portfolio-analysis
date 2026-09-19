import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AdminLayout } from './AdminLayout'
import { Card, CardBody, CardHeader } from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'
import { DocumentLink } from '../../components/ui/DocumentLink'
import { applicationService } from '../../services/applicationService'
import { caseService } from '../../services/caseService'
import { getServiceById } from '../../config/services'
import type { WelfareApplication } from '../../types'
import { formatDateTime, formatFileSize } from '../../lib/format'

export function CaseManagement() {
  const { applicationId } = useParams<{ applicationId: string }>()
  const navigate = useNavigate()
  const [application, setApplication] = useState<WelfareApplication | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [showRequestInfo, setShowRequestInfo] = useState(false)
  const [showReject, setShowReject] = useState(false)

  useEffect(() => {
    let cancelled = false
    if (!applicationId) return
    applicationService.getApplication(applicationId).then((app) => {
      if (cancelled) return
      if (!app) {
        setNotFound(true)
      } else {
        setApplication(app)
      }
      setIsLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [applicationId])

  async function refresh() {
    if (!applicationId) return
    const app = await applicationService.getApplication(applicationId)
    setApplication(app)
  }

  async function runAction(key: string, action: () => Promise<WelfareApplication>) {
    setActionLoading(key)
    try {
      const updated = await action()
      setApplication(updated)
    } finally {
      setActionLoading(null)
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="mx-auto max-w-4xl px-4 py-14 text-center text-slate-500 sm:px-6">Loading case&hellip;</div>
      </AdminLayout>
    )
  }

  if (notFound || !application) {
    return (
      <AdminLayout>
        <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
          <Alert tone="warning" title="Case not found">
            This application could not be found.
          </Alert>
          <Link to="/admin" className="mt-4 inline-block text-sm font-medium text-navy-800 hover:underline">
            &larr; Back to dashboard
          </Link>
        </div>
      </AdminLayout>
    )
  }

  const service = getServiceById(application.serviceId)
  const isDecided = application.status === 'approved' || application.status === 'rejected'

  return (
    <AdminLayout>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <Link to="/admin" className="text-sm font-medium text-navy-800 hover:underline">
          &larr; Back to dashboard
        </Link>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{application.applicationNumber}</h1>
            <p className="mt-1 text-slate-600">
              {service?.title ?? application.serviceId} &middot; {application.applicantName}
            </p>
          </div>
          <StatusBadge status={application.status} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="font-medium text-slate-900">Applicant details</h2>
              </CardHeader>
              <CardBody>
                <dl className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-slate-500">Account email</dt>
                    <dd className="mt-0.5 text-slate-900">{application.applicantEmail}</dd>
                  </div>
                  {Object.entries(application.answers).map(([key, value]) => {
                    const field = service?.steps
                      .flatMap((s) => s.fields ?? [])
                      .find((f) => f.id === key)
                    if (!field) return null
                    const label =
                      field.type === 'select' || field.type === 'radio'
                        ? field.options?.find((o) => o.value === value)?.label ?? value
                        : value
                    return (
                      <div key={key}>
                        <dt className="text-xs uppercase tracking-wide text-slate-500">{field.label}</dt>
                        <dd className="mt-0.5 whitespace-pre-line text-slate-900">{label || '—'}</dd>
                      </div>
                    )
                  })}
                </dl>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="font-medium text-slate-900">Documents</h2>
              </CardHeader>
              <CardBody>
                {application.documents.length === 0 ? (
                  <p className="text-sm text-slate-500">No documents were uploaded.</p>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {application.documents.map((doc) => (
                      <li key={doc.id} className="flex items-center justify-between py-2 text-sm">
                        <DocumentLink document={doc} />
                        <span className="text-slate-400">{formatFileSize(doc.fileSize)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="font-medium text-slate-900">Audit history</h2>
              </CardHeader>
              <CardBody>
                <ol className="space-y-3">
                  {[...application.auditEvents].reverse().map((event) => (
                    <li key={event.id} className="border-l-2 border-slate-200 pl-3">
                      <p className="text-sm font-medium text-slate-900">{event.action.replaceAll('_', ' ')}</p>
                      <p className="text-sm text-slate-600">{event.description}</p>
                      <p className="text-xs text-slate-400">
                        {formatDateTime(event.timestamp)} &middot; {event.actor}
                      </p>
                    </li>
                  ))}
                </ol>
              </CardBody>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="font-medium text-slate-900">Eligibility result</h2>
              </CardHeader>
              <CardBody>
                {application.eligibilityResult ? (
                  <>
                    <Badge tone={application.eligibilityResult.outcome === 'potentially-eligible' ? 'success' : 'warning'}>
                      {application.eligibilityResult.outcome === 'potentially-eligible'
                        ? 'Potentially eligible'
                        : 'Requires review'}
                    </Badge>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
                      {application.eligibilityResult.reasons.map((reason) => (
                        <li key={reason}>{reason}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="text-sm text-slate-500">Not yet assessed.</p>
                )}
                {application.processingRoute && (
                  <p className="mt-3 text-sm text-slate-700">
                    Route:{' '}
                    <span className="font-medium">
                      {application.processingRoute.route === 'automatic' ? 'Automatic candidate' : 'Manual review'}
                    </span>
                  </p>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="font-medium text-slate-900">Case actions</h2>
              </CardHeader>
              <CardBody className="space-y-3">
                {isDecided ? (
                  <p className="text-sm text-slate-500">
                    This case has been decided. No further action is available in this demo.
                  </p>
                ) : (
                  <>
                    <Button
                      fullWidth
                      variant="secondary"
                      loading={actionLoading === 'review'}
                      onClick={() => runAction('review', () => caseService.startReview(application.id))}
                    >
                      Start officer review
                    </Button>
                    <Button
                      fullWidth
                      variant="secondary"
                      loading={actionLoading === 'manual'}
                      onClick={() => runAction('manual', () => caseService.sendToManualReview(application.id))}
                    >
                      Send to manual review
                    </Button>

                    {showRequestInfo ? (
                      <div className="rounded-md border border-slate-200 p-3">
                        <label htmlFor="request-note" className="text-xs font-medium text-slate-600">
                          Note to applicant
                        </label>
                        <textarea
                          id="request-note"
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          rows={2}
                          className="mt-1 w-full rounded-md border border-slate-300 px-2.5 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-600/40"
                          placeholder="e.g. Please provide an updated payslip"
                        />
                        <div className="mt-2 flex gap-2">
                          <Button
                            size="sm"
                            loading={actionLoading === 'request-info'}
                            onClick={async () => {
                              await runAction('request-info', () => caseService.requestInformation(application.id, note))
                              setShowRequestInfo(false)
                              setNote('')
                            }}
                          >
                            Send request
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setShowRequestInfo(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button fullWidth variant="secondary" onClick={() => setShowRequestInfo(true)}>
                        Request information
                      </Button>
                    )}

                    <Button
                      fullWidth
                      loading={actionLoading === 'approve'}
                      onClick={() => runAction('approve', () => caseService.approve(application.id))}
                    >
                      Approve
                    </Button>

                    {showReject ? (
                      <div className="rounded-md border border-red-200 bg-red-50 p-3">
                        <label htmlFor="reject-note" className="text-xs font-medium text-slate-600">
                          Reason for rejection
                        </label>
                        <textarea
                          id="reject-note"
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          rows={2}
                          className="mt-1 w-full rounded-md border border-slate-300 px-2.5 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-600/40"
                          placeholder="e.g. Income above threshold"
                        />
                        <div className="mt-2 flex gap-2">
                          <Button
                            size="sm"
                            variant="danger"
                            loading={actionLoading === 'reject'}
                            onClick={async () => {
                              await runAction('reject', () => caseService.reject(application.id, note))
                              setShowReject(false)
                              setNote('')
                            }}
                          >
                            Confirm rejection
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setShowReject(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button fullWidth variant="danger" onClick={() => setShowReject(true)}>
                        Reject
                      </Button>
                    )}
                  </>
                )}
                <button
                  type="button"
                  onClick={() => {
                    refresh()
                    navigate('/admin')
                  }}
                  className="mt-2 w-full text-center text-sm font-medium text-navy-800 hover:underline"
                >
                  Done &mdash; back to dashboard
                </button>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
