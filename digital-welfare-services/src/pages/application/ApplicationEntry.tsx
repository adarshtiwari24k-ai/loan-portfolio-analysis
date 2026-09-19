import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { Alert } from '../../components/ui/Alert'
import { getServiceById } from '../../config/services'
import { applicationService } from '../../services/applicationService'
import { useAuth } from '../../context/AuthContext'
import type { WelfareApplication } from '../../types'
import { ApplicationWizard } from './ApplicationWizard'
import { ApplicationStatusView } from './ApplicationStatusView'

/**
 * Resolves the /apply/:serviceId and /apply/:serviceId/:applicationId routes:
 * creates a new draft (or resumes an existing one) when no application id is
 * present, then hands off to the step wizard (drafts) or the read-only
 * status view (submitted applications).
 */
export function ApplicationEntry() {
  const { serviceId, applicationId } = useParams<{ serviceId: string; applicationId?: string }>()
  const { user } = useAuth()
  const [resolvedId, setResolvedId] = useState<string | null>(applicationId ?? null)
  const [application, setApplication] = useState<WelfareApplication | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const service = serviceId ? getServiceById(serviceId) : undefined

  useEffect(() => {
    let cancelled = false
    async function resolve() {
      if (!user || !serviceId || !service) return
      setIsLoading(true)

      if (applicationId) {
        const existing = await applicationService.getApplication(applicationId)
        if (cancelled) return
        if (!existing || existing.applicantEmail !== user.email) {
          setNotFound(true)
          setIsLoading(false)
          return
        }
        setApplication(existing)
        setResolvedId(existing.id)
        setIsLoading(false)
        return
      }

      const draft = await applicationService.findExisting(user.email, serviceId)
      if (cancelled) return
      if (draft && draft.status === 'draft') {
        setResolvedId(draft.id)
        setIsLoading(false)
        return
      }

      const created = await applicationService.createApplication({
        serviceId,
        applicantEmail: user.email,
        applicantName: user.name,
      })
      if (cancelled) return
      setResolvedId(created.id)
      setIsLoading(false)
    }
    resolve()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, serviceId, applicationId])

  if (!service) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
          <Alert tone="warning" title="Service not found">
            This service is not available.
          </Alert>
        </div>
      </Layout>
    )
  }

  if (!service.fullyFunctional) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
          <Alert tone="info" title={`${service.title} is a catalogue preview`}>
            This service demonstrates the service catalogue but does not have a complete application
            flow enabled in this prototype. Employment Support Benefit is fully functional.
          </Alert>
        </div>
      </Layout>
    )
  }

  if (notFound) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
          <Alert tone="warning" title="Application not found">
            We couldn&apos;t find that application, or it doesn&apos;t belong to your account.
          </Alert>
        </div>
      </Layout>
    )
  }

  if (isLoading || !resolvedId) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-4 py-14 text-center text-slate-500 sm:px-6">
          Loading your application&hellip;
        </div>
      </Layout>
    )
  }

  // Deep-link to a stable URL that includes the application id, so refreshing
  // or bookmarking always resumes the same draft.
  if (!applicationId) {
    return <Navigate to={`/apply/${serviceId}/${resolvedId}`} replace />
  }

  if (application && application.status !== 'draft') {
    return <ApplicationStatusView application={application} service={service} />
  }

  return <ApplicationWizard serviceId={serviceId!} applicationId={resolvedId} />
}
