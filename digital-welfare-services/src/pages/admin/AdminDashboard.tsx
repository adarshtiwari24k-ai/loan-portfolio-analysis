import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminLayout } from './AdminLayout'
import { Card, CardBody } from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { Badge } from '../../components/ui/Badge'
import { applicationService } from '../../services/applicationService'
import { getServiceById } from '../../config/services'
import type { WelfareApplication } from '../../types'
import { formatDateTime } from '../../lib/format'

export function AdminDashboard() {
  const [applications, setApplications] = useState<WelfareApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    applicationService.listAll().then((apps) => {
      if (cancelled) return
      setApplications(apps)
      setIsLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const submitted = useMemo(() => applications.filter((app) => app.status !== 'draft'), [applications])

  const stats = useMemo(() => {
    const pending = submitted.filter(
      (app) => app.status === 'eligibility-assessment' || app.status === 'officer-review' || app.status === 'information-requested',
    ).length
    const automatic = submitted.filter((app) => app.processingRoute?.route === 'automatic').length
    const manual = submitted.filter((app) => app.processingRoute?.route === 'manual').length
    const approved = submitted.filter((app) => app.status === 'approved').length
    const rejected = submitted.filter((app) => app.status === 'rejected').length
    return { received: submitted.length, pending, automatic, manual, approved, rejected }
  }, [submitted])

  return (
    <AdminLayout>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-semibold text-slate-900">Applications dashboard</h1>
        <p className="mt-1 text-slate-600">
          Overview of applications submitted across all services on this device.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: 'Applications received', value: stats.received },
            { label: 'Pending review', value: stats.pending },
            { label: 'Automatic processing', value: stats.automatic },
            { label: 'Manual review', value: stats.manual },
            { label: 'Approved', value: stats.approved },
            { label: 'Rejected', value: stats.rejected },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardBody>
                <p className="text-xs text-slate-500">{stat.label}</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">{stat.value}</p>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-slate-900">All applications</h2>

          {isLoading ? (
            <p className="mt-4 text-sm text-slate-500">Loading&hellip;</p>
          ) : submitted.length === 0 ? (
            <Card className="mt-4">
              <CardBody className="text-center text-slate-500">
                No applications have been submitted yet. Submit a citizen application to see it appear
                here.
              </CardBody>
            </Card>
          ) : (
            <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 bg-white">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-medium">Application number</th>
                    <th scope="col" className="px-4 py-3 font-medium">Applicant</th>
                    <th scope="col" className="px-4 py-3 font-medium">Service</th>
                    <th scope="col" className="px-4 py-3 font-medium">Submitted</th>
                    <th scope="col" className="px-4 py-3 font-medium">Eligibility</th>
                    <th scope="col" className="px-4 py-3 font-medium">Status</th>
                    <th scope="col" className="px-4 py-3 font-medium">Assigned officer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submitted.map((application) => {
                    const service = getServiceById(application.serviceId)
                    return (
                      <tr key={application.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <Link
                            to={`/admin/case/${application.id}`}
                            className="font-medium text-navy-800 hover:underline"
                          >
                            {application.applicationNumber}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-slate-700">{application.applicantName}</td>
                        <td className="px-4 py-3 text-slate-600">{service?.title ?? application.serviceId}</td>
                        <td className="px-4 py-3 text-slate-600">{formatDateTime(application.submittedAt)}</td>
                        <td className="px-4 py-3">
                          {application.eligibilityResult ? (
                            <Badge tone={application.eligibilityResult.outcome === 'potentially-eligible' ? 'success' : 'warning'}>
                              {application.eligibilityResult.outcome === 'potentially-eligible'
                                ? 'Potentially eligible'
                                : 'Requires review'}
                            </Badge>
                          ) : (
                            <span className="text-slate-400">&mdash;</span>
                          )}
                        </td>
                        <td className="px-4 py-3"><StatusBadge status={application.status} /></td>
                        <td className="px-4 py-3 text-slate-600">{application.assignedOfficer ?? '—'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
