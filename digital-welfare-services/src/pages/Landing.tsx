import { Link } from 'react-router-dom'
import { Briefcase, FileCheck2, Home as HomeIcon, ShieldCheck, Users } from 'lucide-react'
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

export function Landing() {
  const { user } = useAuth()

  return (
    <Layout>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:items-center md:py-20">
          <div>
            <p className="text-sm font-medium text-slate-500">Digital Welfare Services</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl md:text-[44px] md:leading-tight">
              Apply for government support online
            </h1>
            <p className="mt-4 max-w-xl text-lg text-slate-600">
              Complete applications, upload documents, track progress and receive updates from one
              secure digital service.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to={user ? '/apply/employment-support' : '/login'}
                className="inline-flex items-center justify-center rounded-md bg-navy-900 px-6 py-3 text-base font-medium text-white hover:bg-navy-800"
              >
                Start an application
              </Link>
              <Link
                to={user ? '/my-applications' : '/login'}
                className="inline-flex items-center justify-center rounded-md border border-navy-900 px-6 py-3 text-base font-medium text-navy-900 hover:bg-slate-100"
              >
                View my applications
              </Link>
            </div>
            <p className="mt-6 flex items-center gap-2 text-sm text-slate-500">
              <ShieldCheck className="h-4 w-4 text-accent-600" />
              Demonstration platform. No real personal data is collected.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
            <dl className="grid grid-cols-2 gap-6">
              <div>
                <dt className="text-sm text-slate-500">Applications this month</dt>
                <dd className="mt-1 text-2xl font-semibold text-slate-900">6,482</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Processed automatically</dt>
                <dd className="mt-1 text-2xl font-semibold text-slate-900">70%</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Median decision time</dt>
                <dd className="mt-1 text-2xl font-semibold text-slate-900">3 days</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Services available</dt>
                <dd className="mt-1 text-2xl font-semibold text-slate-900">{serviceCatalogue.length}</dd>
              </div>
            </dl>
            <p className="mt-6 text-xs text-slate-400">
              Illustrative figures for this prototype, not live statistics.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Available services</h2>
            <p className="mt-1 text-slate-600">
              Every service on this platform is built from the same reusable application engine.
            </p>
          </div>
          <Link to="/services" className="hidden text-sm font-medium text-navy-800 hover:underline sm:block">
            View all services
          </Link>
        </div>

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
                    {service.fullyFunctional ? (
                      <Badge tone="success">Available now</Badge>
                    ) : (
                      <Badge tone="neutral">Catalogue preview</Badge>
                    )}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">{service.title}</h3>
                  <p className="mt-1.5 flex-1 text-sm text-slate-600">{service.summary}</p>
                  <p className="mt-3 text-xs text-slate-400">{service.processingTime}</p>
                  <Link
                    to={service.fullyFunctional ? (user ? `/apply/${service.id}` : '/login') : '/services'}
                    className="mt-4 inline-flex items-center text-sm font-medium text-navy-800 hover:underline"
                  >
                    {service.fullyFunctional ? 'Start an application' : 'Learn more'} &rarr;
                  </Link>
                </CardBody>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <FileCheck2 className="h-6 w-6 text-navy-800" />
              <h3 className="mt-3 text-base font-semibold text-slate-900">One application engine</h3>
              <p className="mt-1.5 text-sm text-slate-600">
                Every service reuses the same configurable steps, validation and eligibility engine, so
                new services can be added without rebuilding a website from scratch.
              </p>
            </div>
            <div>
              <ShieldCheck className="h-6 w-6 text-navy-800" />
              <h3 className="mt-3 text-base font-semibold text-slate-900">Automated and manual review</h3>
              <p className="mt-1.5 text-sm text-slate-600">
                A demonstration rules engine routes straightforward applications for automatic
                processing and flags the rest for officer review.
              </p>
            </div>
            <div>
              <Users className="h-6 w-6 text-navy-800" />
              <h3 className="mt-3 text-base font-semibold text-slate-900">Built for scale</h3>
              <p className="mt-1.5 text-sm text-slate-600">
                Inspired by how large-scale digital services can be extended quickly to support new
                payments when demand rises sharply.
              </p>
            </div>
          </div>
          <Link
            to="/architecture"
            className="mt-8 inline-flex items-center text-sm font-medium text-navy-800 hover:underline"
          >
            See how the platform works &rarr;
          </Link>
        </div>
      </section>
    </Layout>
  )
}
