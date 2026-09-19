import { Layout } from '../components/layout/Layout'
import { Card, CardBody } from '../components/ui/Card'

const faqs = [
  {
    question: 'Is this a real government service?',
    answer:
      'No. Digital Welfare Services is an educational prototype inspired by publicly documented information about Ireland’s MyWelfare platform. It is not affiliated with any government department, and no real application, payment or identity check occurs here.',
  },
  {
    question: 'Where is my data stored?',
    answer:
      'Everything you enter, including uploaded document names and sizes, is stored only in your own browser’s local storage. Nothing is sent to a server. Clearing your browser data will remove it.',
  },
  {
    question: 'How does the eligibility assessment work?',
    answer:
      'Step 3 of the Employment Support Benefit application runs a simplified, clearly-labelled demonstration rules engine over your answers. It gives a provisional "potentially eligible" or "requires review" result only, never a final decision.',
  },
  {
    question: 'What happens after I submit an application?',
    answer:
      'Your application is assigned an application number, routed for automatic or manual processing based on the demonstration rules engine, and appears in both your dashboard and the officer/admin portal, where a simulated caseworker can review it.',
  },
  {
    question: 'Can I save my progress and come back later?',
    answer:
      'Yes. Use "Save and exit" at any step, or simply close the tab — your draft is saved automatically and will still be there when you return, even after refreshing the page.',
  },
]

export function Help() {
  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-semibold text-slate-900">Help</h1>
        <p className="mt-2 text-slate-600">
          Answers to common questions about how this prototype works.
        </p>

        <div className="mt-8 space-y-4">
          {faqs.map((faq) => (
            <Card key={faq.question}>
              <CardBody>
                <h2 className="font-medium text-slate-900">{faq.question}</h2>
                <p className="mt-1.5 text-sm text-slate-600">{faq.answer}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}
