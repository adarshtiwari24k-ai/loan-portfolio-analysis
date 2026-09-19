import { Layout } from '../components/layout/Layout'
import { Alert } from '../components/ui/Alert'
import { Card, CardBody } from '../components/ui/Card'

const layers = [
  { title: 'Citizen', detail: 'Applies for support, uploads documents and tracks progress from any device.' },
  { title: 'Digital Experience Layer', detail: 'The React web application: landing pages, sign-in, dashboard and forms.' },
  { title: 'Application Engine', detail: 'A configuration-driven engine that renders steps, validation and progress for any service.' },
  { title: 'Reusable Services', detail: 'Service definitions such as Employment Support, Housing Support and Child Benefit.' },
  { title: 'Rules Engine', detail: 'Evaluates demonstration eligibility rules and decides automatic vs. manual routing.' },
  { title: 'API / Integration Layer', detail: 'A service/repository layer (mocked here) that a real backend API would implement.' },
  { title: 'Government Systems', detail: 'Illustrative back-office systems: identity, payments, records — not implemented in this demo.' },
  { title: 'Case Management', detail: 'Where officers review, request information, approve or reject applications.' },
]

const crossCutting = [
  'Identity',
  'Documents',
  'Notifications',
  'Analytics',
  'Audit',
]

export function Architecture() {
  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-semibold text-slate-900">How the platform works</h1>
        <p className="mt-2 text-slate-600">
          A conceptual view of how a configurable government digital service platform like this
          prototype can be structured.
        </p>

        <div className="mt-4">
          <Alert tone="warning" title="Conceptual architecture for this prototype">
            This diagram illustrates a plausible architecture pattern for a platform like MyWelfare,
            based on publicly available information. It is not the actual MyWelfare architecture, which
            is not publicly documented in detail.
          </Alert>
        </div>

        <div className="mt-8 space-y-3">
          {layers.map((layer, index) => (
            <div key={layer.title}>
              <Card>
                <CardBody className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-900 text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-slate-900">{layer.title}</p>
                    <p className="mt-0.5 text-sm text-slate-600">{layer.detail}</p>
                  </div>
                </CardBody>
              </Card>
              {index < layers.length - 1 && (
                <div className="flex justify-center py-1" aria-hidden="true">
                  <div className="h-4 w-px bg-slate-300" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-semibold text-slate-900">Cross-cutting capabilities</h2>
          <p className="mt-1 text-sm text-slate-600">
            These capabilities support every layer of the platform rather than sitting at a single
            point in the flow.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {crossCutting.map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">About the real MyWelfare platform</h2>
          <p className="mt-2 text-sm text-slate-600">
            Publicly documented information indicates that Ireland&apos;s Department of Social
            Protection worked with Deloitte to design and implement MyWelfare, using a Microsoft Azure
            hybrid-cloud architecture and an &quot;Intake &rarr; Imagine &rarr; Deliver &rarr; Run&quot;
            agile delivery approach with cross-functional pods. During COVID-19, the platform was
            adapted at pace to deliver the Pandemic Unemployment Payment online, reportedly processing
            more than 60,000 payments within a week of the scheme&apos;s announcement. This prototype
            takes inspiration from those publicly reported facts to illustrate the kind of architecture
            that could support that outcome &mdash; it does not reproduce or claim to represent
            MyWelfare&apos;s actual internal design.
          </p>
        </div>
      </div>
    </Layout>
  )
}
