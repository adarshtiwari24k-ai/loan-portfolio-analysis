import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { Card, CardBody } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/StatusBadge'
import { useAuth } from '../context/AuthContext'
import { applicationService } from '../services/applicationService'
import { getServiceById } from '../config/services'
import type { WelfareApplication } from '../types'
import { formatDateTime } from '../lib/format'
import { getProgressPercent } from '../lib/progress'

export function MyApplications() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<WelfareApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    if (!user) return
    applicationService.listByUser(user.email).then((apps) => {
      if (!cancelled) {
        setApplications(apps)
        setIsLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [user])

  if (!user) return null

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-semibold text-slate-900">My Applications</h1>
        <p className="mt-2 text-slate-600">All the applications you have started or submitted.</p>

        {isLoading ? (
          <p className="mt-6 text-sm text-slate-500">Loading&hellip;</p>
        ) : applications.length === 0 ? (
          <Card className="mt-6">
            <CardBody className="text-center">
              <p className="text-slate-600">You haven&apos;t started any applications yet.</p>
              <Link
                to="/apply/employment-support"
                className="mt-3 inline-flex items-center justify-center rounded-md bg-navy-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-navy-800"
              >
                Start an application
              </Link>
            </CardBody>
          </Card>
        ) : (
          <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Application</th>
                  <th scope="col" className="px-4 py-3 font-medium">Service</th>
                  <th scope="col" className="px-4 py-3 font-medium">Last updated</th>
                  <th scope="col" className="px-4 py-3 font-medium">Progress</th>
                  <th scope="col" className="px-4 py-3 font-medium">Status</th>
                  <th scope="col" className="px-4 py-3 font-medium sr-only">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((application) => {
                  const service = getServiceById(application.serviceId)
                  const progress = getProgressPercent(application, service)
                  return (
                    <tr key={application.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{application.applicationNumber}</td>
                      <td className="px-4 py-3 text-slate-600">{service?.title ?? application.serviceId}</td>
                      <td className="px-4 py-3 text-slate-600">{formatDateTime(application.updatedAt)}</td>
                      <td className="px-4 py-3 text-slate-600">{progress}%</td>
                      <td className="px-4 py-3"><StatusBadge status={application.status} /></td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to={`/apply/${application.serviceId}/${application.id}`}
                          className="font-medium text-navy-800 hover:underline"
                        >
                          {application.status === 'draft' ? 'Continue' : 'View'}
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  )
}
