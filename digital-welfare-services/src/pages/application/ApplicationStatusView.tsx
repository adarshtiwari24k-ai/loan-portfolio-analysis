import { Link } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { Card, CardBody, CardHeader } from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { StatusTimeline } from '../../components/ui/StatusTimeline'
import { Badge } from '../../components/ui/Badge'
import { DocumentLink } from '../../components/ui/DocumentLink'
import type { ServiceDefinition, WelfareApplication } from '../../types'
import { formatDateTime, formatFileSize } from '../../lib/format'

export function ApplicationStatusView({
  application,
  service,
}: {
  application: WelfareApplication
  service: ServiceDefinition
}) {
  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Link to="/dashboard" className="text-sm font-medium text-navy-800 hover:underline">
          &larr; Back to dashboard
        </Link>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{service.title}</h1>
            <p className="mt-1 text-slate-600">Application number: {application.applicationNumber}</p>
          </div>
          <StatusBadge status={application.status} />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-5">
          <Card className="md:col-span-3">
            <CardHeader>
              <h2 className="font-medium text-slate-900">Application timeline</h2>
            </CardHeader>
            <CardBody>
              <StatusTimeline application={application} />
            </CardBody>
          </Card>

          <div className="space-y-6 md:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="font-medium text-slate-900">Eligibility assessment</h2>
              </CardHeader>
              <CardBody>
                {application.eligibilityResult ? (
                  <>
                    <Badge tone={application.eligibilityResult.outcome === 'potentially-eligible' ? 'success' : 'warning'}>
                      {application.eligibilityResult.outcome === 'potentially-eligible'
                        ? 'Potentially eligible'
                        : 'Further review required'}
                    </Badge>
                    <p className="mt-2 text-xs text-slate-500">
                      Provisional demonstration assessment only, not a final decision.
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-slate-500">Not yet assessed.</p>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="font-medium text-slate-900">Processing route</h2>
              </CardHeader>
              <CardBody>
                {application.processingRoute ? (
                  <p className="text-sm text-slate-700">
                    {application.processingRoute.route === 'automatic'
                      ? 'Automatic processing candidate'
                      : 'Manual officer review required'}
                  </p>
                ) : (
                  <p className="text-sm text-slate-500">Not yet determined.</p>
                )}
              </CardBody>
            </Card>
          </div>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <h2 className="font-medium text-slate-900">Documents submitted</h2>
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

        <Card className="mt-6">
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
    </Layout>
  )
}
