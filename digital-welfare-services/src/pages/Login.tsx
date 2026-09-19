import { useState } from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { IdCard, ShieldCheck, UserRound } from 'lucide-react'
import { Layout } from '../components/layout/Layout'
import { Button } from '../components/ui/Button'
import { Alert } from '../components/ui/Alert'
import { useAuth } from '../context/AuthContext'

export function Login() {
  const { user, signInWithDigitalId, signInAsDemoCitizen } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [loadingMethod, setLoadingMethod] = useState<'digital-id' | 'demo' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/dashboard'

  if (user) {
    return <Navigate to={redirectTo} replace />
  }

  async function handleSignIn(method: 'digital-id' | 'demo') {
    setError(null)
    setLoadingMethod(method)
    try {
      if (method === 'digital-id') {
        await signInWithDigitalId()
      } else {
        await signInAsDemoCitizen()
      }
      navigate(redirectTo, { replace: true })
    } catch {
      setError('Sign in failed. Please try again.')
    } finally {
      setLoadingMethod(null)
    }
  }

  return (
    <Layout>
      <div className="mx-auto flex max-w-md flex-col px-4 py-14 sm:px-6">
        <h1 className="text-2xl font-semibold text-slate-900">Sign in to Digital Welfare Services</h1>
        <p className="mt-2 text-slate-600">
          Choose how you would like to sign in to continue to your applications.
        </p>

        {error && (
          <div className="mt-4">
            <Alert tone="warning" title="Sign in problem">
              {error}
            </Alert>
          </div>
        )}

        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-navy-900/5 text-navy-900">
              <IdCard className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-medium text-slate-900">Sign in with Digital ID</h2>
              <p className="mt-1 text-sm text-slate-600">
                Simulated identity verification for this prototype. No real ID check is performed.
              </p>
            </div>
          </div>
          <Button
            fullWidth
            className="mt-4"
            loading={loadingMethod === 'digital-id'}
            disabled={loadingMethod !== null}
            onClick={() => handleSignIn('digital-id')}
          >
            Sign in with Digital ID
          </Button>
        </div>

        <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          OR
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="rounded-lg border-2 border-dashed border-accent-500/40 bg-accent-100 p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-accent-600">
              <UserRound className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-medium text-slate-900">Continue as demo citizen</h2>
              <p className="mt-1 text-sm text-slate-700">
                <strong>DEMO ACCOUNT</strong> &mdash; signs you in as Alex Morgan with sample data
                pre-loaded so you can explore the full application journey immediately.
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            fullWidth
            className="mt-4 border-accent-600 text-accent-600 hover:bg-white"
            loading={loadingMethod === 'demo'}
            disabled={loadingMethod !== null}
            onClick={() => handleSignIn('demo')}
          >
            Continue as demo citizen
          </Button>
        </div>

        <p className="mt-6 flex items-start gap-2 text-xs text-slate-500">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          This is a demonstration of government digital identity concepts. It does not verify your real
          identity and should not be used for any real application.
        </p>
      </div>
    </Layout>
  )
}
