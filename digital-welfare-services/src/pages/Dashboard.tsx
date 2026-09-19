import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, FilePlus2, Mail, ShieldCheck } from 'lucide-react'
import { Layout } from '../components/layout/Layout'
import { Card, CardBody } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { StatusBadge } from '../components/ui/StatusBadge'
import { StatusTimeline } from '../components/ui/StatusTimeline'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'
import { applicationService } from '../services/applicationService'
import { getServiceById, serviceCatalogue } from '../config/services'
import type { WelfareApplication } from '../types'
import { getProgressPercent } from '../lib/progress'

export function Dashboard() {
  const { user } = useAuth()
  const { unreadCount } = useNotifications()
  const [applications, setApplications] = useState<WelfareApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    if (!user) return
    setIsLoading(true)
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

  const draftApplications = applications.filter((app) => app.status === 'draft')
  const firstName = user.name.split(' ')[0]

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-semibold text-slate-900">Welcome, {firstName}</h1>
        <p className="mt-1 text-slate-600">Here&apos;s an overview of your account and applications.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardBody className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-navy-900/5 text-navy-900">
                <ClipboardList className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm text-slate-500">Applications</p>
                <p className="mt-0.5 text-lg font-semibold text-slate-900">
                  {applications.length === 0
                    ? 'None yet'
                    : `${applications.length} application${applications.length === 1 ? '' : 's'}`}
                </p>
                <p className="text-xs text-slate-500">
                  {draftApplications.length} active draft{draftApplications.length === 1 ? '' : 's'}
                </p>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-navy-900/5 text-navy-900">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm text-slate-500">Messages</p>
                <p className="mt-0.5 text-lg font-semibold text-slate-900">
                  {unreadCount} unread
                </p>
                <p className="text-xs text-slate-500">Notifications about your applications</p>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-100 text-accent-600">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm text-slate-500">Profile</p>
                <p className="mt-0.5 text-lg font-semibold text-slate-900">Identity verified</p>
                <p className="text-xs text-slate-500">
                  Signed in via {user.method === 'digital-id' ? 'Digital ID' : 'demo citizen account'}
                </p>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="mt-10 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Services</h2>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {serviceCatalogue.map((service) => (
            <Card key={service.id}>
              <CardBody>
                <h3 className="font-medium text-slate-900">{service.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{service.summary}</p>
                <Link
                  to={service.fullyFunctional ? `/apply/${service.id}` : '/services'}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-navy-800 hover:underline"
                >
                  <FilePlus2 className="h-4 w-4" />
                  {service.fullyFunctional ? 'Start a new application' : 'View details'}
                </Link>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-semibold text-slate-900">Your applications</h2>

          {isLoading ? (
            <p className="mt-4 text-sm text-slate-500">Loading your applications&hellip;</p>
          ) : applications.length === 0 ? (
            <Card className="mt-4">
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
            <div className="mt-4 space-y-4">
              {applications.map((application) => {
                const service = getServiceById(application.serviceId)
                const progress = getProgressPercent(application, service)
                return (
                  <Card key={application.id}>
                    <CardBody>
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-slate-900">{service?.title ?? application.serviceId}</p>
                          <p className="mt-0.5 text-sm text-slate-500">
                            Application number: {application.applicationNumber}
                          </p>
                        </div>
                        <StatusBadge status={application.status} />
                      </div>

                      {application.status === 'draft' ? (
                        <>
                          <div className="mt-4">
                            <div className="mb-1 flex justify-between text-xs text-slate-500">
                              <span>Progress</span>
                              <span>{progress}%</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                              <div
                                className="h-full rounded-full bg-navy-900"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                          <Link to={`/apply/${application.serviceId}/${application.id}`}>
                            <Button className="mt-4">Continue application</Button>
                          </Link>
                        </>
                      ) : (
                        <div className="mt-4 grid gap-6 md:grid-cols-2">
                          <StatusTimeline application={application} />
                          <div className="flex flex-col justify-center gap-2 text-sm text-slate-600">
                            {application.processingRoute && (
                              <p>
                                Processing route:{' '}
                                <span className="font-medium text-slate-900">
                                  {application.processingRoute.route === 'automatic'
                                    ? 'Automatic processing candidate'
                                    : 'Manual officer review required'}
                                </span>
                              </p>
                            )}
                            <Link
                              to={`/apply/${application.serviceId}/${application.id}`}
                              className="font-medium text-navy-800 hover:underline"
                            >
                              View application details
                            </Link>
                          </div>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
