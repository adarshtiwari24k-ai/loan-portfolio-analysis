import { Link } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'

export function NotFound() {
  return (
    <Layout>
      <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
        <p className="text-sm font-medium text-slate-500">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Page not found</h1>
        <p className="mt-2 text-slate-600">The page you are looking for doesn&apos;t exist.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-navy-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-navy-800"
        >
          Return home
        </Link>
      </div>
    </Layout>
  )
}
