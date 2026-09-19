import { Link } from 'react-router-dom'
import { Briefcase, FileCheck2, Home as HomeIcon, Users } from 'lucide-react'
import { Layout } from '../components/layout/Layout'
import { Card, CardBody } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { serviceCatalogue } from '../config/services'
import { useAuth } from '../context/AuthContext'

const serviceIcons: Record<string, typeof Briefcase> = {
  'employment-support': Briefcase,
  'housing-support': HomeIcon,
  'child-benefit': Users,
}

export function Services() {
  const { user } = useAuth()

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-semibold text-slate-900">Service catalogue</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Every service below is defined as configuration &mdash; steps, fields, required documents and
          eligibility rules &mdash; and rendered by the same application engine. This demonstrates how a
          platform like this can add new services without building a new website each time.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {serviceCatalogue.map((service) => {
            const Icon = serviceIcons[service.id] ?? FileCheck2
            return (
              <Card key={service.id} className="flex flex-col">
                <CardBody className="flex flex-1 flex-col">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-navy-900/5 text-navy-900">
                      <Icon className="h-5 w-5" />
                    </span>
                    <Badge tone="neutral">{service.category}</Badge>
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-slate-900">{service.title}</h2>
                  <p className="mt-1.5 flex-1 text-sm text-slate-600">{service.summary}</p>

                  <div className="mt-4 space-y-1 text-xs text-slate-500">
                    <p>{service.steps.length} application steps</p>
                    <p>{service.requiredDocuments.length} required documents</p>
                    <p>{service.processingTime}</p>
                  </div>

                  {service.fullyFunctional ? (
                    <Link
                      to={user ? `/apply/${service.id}` : '/login'}
                      className="mt-4 inline-flex items-center justify-center rounded-md bg-navy-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-navy-800"
                    >
                      Start an application
                    </Link>
                  ) : (
                    <p className="mt-4 rounded-md bg-slate-100 px-3 py-2.5 text-center text-xs text-slate-500">
                      Catalogue preview &mdash; full application flow not enabled in this prototype
                    </p>
                  )}
                </CardBody>
              </Card>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}
