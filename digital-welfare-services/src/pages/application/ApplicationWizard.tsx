import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { Layout } from '../../components/layout/Layout'
import { Button } from '../../components/ui/Button'
import { ProgressStepper } from '../../components/ui/ProgressStepper'
import { Alert } from '../../components/ui/Alert'
import { FormStepFields } from '../../components/application/FormStepFields'
import { DocumentsStep } from '../../components/application/DocumentsStep'
import { DeclarationStep } from '../../components/application/DeclarationStep'
import { ReviewStep } from '../../components/application/ReviewStep'
import { SubmitStep } from '../../components/application/SubmitStep'
import { EligibilityResultPanel } from '../../components/application/EligibilityResultPanel'
import { ApplicationStatusView } from './ApplicationStatusView'
import { getServiceById } from '../../config/services'
import { applicationService } from '../../services/applicationService'
import { saveDocumentBlob, deleteDocumentBlob } from '../../services/documentStore'
import { validateStepFields } from '../../lib/validation'
import { demoAnswers, demoDocuments, buildDemoFile } from '../../config/demoData'
import type { WelfareApplication } from '../../types'

interface ApplicationWizardProps {
  serviceId: string
  applicationId: string
}

export function ApplicationWizard({ serviceId, applicationId }: ApplicationWizardProps) {
  const service = getServiceById(serviceId)!
  const navigate = useNavigate()

  const [application, setApplication] = useState<WelfareApplication | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [stepIndex, setStepIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingRequirementId, setUploadingRequirementId] = useState<string | null>(null)
  const [documentsError, setDocumentsError] = useState<string | undefined>()
  const [declarationError, setDeclarationError] = useState<string | undefined>()
  const [eligibilityChecked, setEligibilityChecked] = useState(false)
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false)
  const [savedNotice, setSavedNotice] = useState(false)
  const [isLoadingDemo, setIsLoadingDemo] = useState(false)

  useEffect(() => {
    let cancelled = false
    applicationService.getApplication(applicationId).then((app) => {
      if (cancelled || !app) return
      setApplication(app)
      setAnswers(app.answers)
      setStepIndex(app.currentStepIndex)
      setEligibilityChecked(Boolean(app.eligibilityResult))
      setIsLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [applicationId])

  useEffect(() => {
    if (!savedNotice) return
    const timeout = setTimeout(() => setSavedNotice(false), 2500)
    return () => clearTimeout(timeout)
  }, [savedNotice])

  const step = service.steps[stepIndex]

  const handleFieldChange = useCallback((fieldId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }))
    setErrors((prev) => {
      if (!prev[fieldId]) return prev
      const next = { ...prev }
      delete next[fieldId]
      return next
    })
  }, [])

  if (isLoading || !application) {
    return (
      <Layout>
        <div className="mx-auto max-w-3xl px-4 py-14 text-center text-slate-500 sm:px-6">
          Loading your application&hellip;
        </div>
      </Layout>
    )
  }

  if (application.status !== 'draft') {
    return <ApplicationStatusView application={application} service={service} />
  }

  async function persist(updates: {
    answers?: Record<string, string>
    currentStepIndex?: number
    declarationAccepted?: boolean
    declarationAcceptedAt?: string
  }) {
    // Only forward keys that were actually provided: an explicit `key: undefined`
    // in the update object would still overwrite the stored value on spread.
    const payload: typeof updates = {}
    if (updates.answers !== undefined) payload.answers = updates.answers
    if (updates.currentStepIndex !== undefined) payload.currentStepIndex = updates.currentStepIndex
    if (updates.declarationAccepted !== undefined) payload.declarationAccepted = updates.declarationAccepted
    if (updates.declarationAcceptedAt !== undefined) payload.declarationAcceptedAt = updates.declarationAcceptedAt

    const updated = await applicationService.saveApplication(application!.id, payload)
    setApplication(updated)
    return updated
  }

  async function goToStep(nextIndex: number, auditDescription?: string) {
    setIsSaving(true)
    try {
      await persist({ answers, currentStepIndex: nextIndex })
      if (auditDescription) {
        const withAudit = await applicationService.addAuditEvent(
          application!.id,
          application!.applicantEmail,
          'STEP_COMPLETED',
          auditDescription,
        )
        setApplication(withAudit)
      }
      setStepIndex(nextIndex)
      setSavedNotice(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setIsSaving(false)
    }
  }

  async function handleSaveAndContinue() {
    if (step.kind === 'form') {
      const stepErrors = validateStepFields(step.fields ?? [], answers)
      setErrors(stepErrors)
      if (Object.keys(stepErrors).length > 0) return
      await goToStep(stepIndex + 1, `Completed step: ${step.title}.`)
      return
    }

    if (step.kind === 'eligibility') {
      const stepErrors = validateStepFields(step.fields ?? [], answers)
      setErrors(stepErrors)
      if (Object.keys(stepErrors).length > 0) return

      if (!eligibilityChecked) {
        setIsCheckingEligibility(true)
        try {
          await persist({ answers })
          const updated = await applicationService.evaluateEligibility(application!.id)
          setApplication(updated)
          setEligibilityChecked(true)
        } finally {
          setIsCheckingEligibility(false)
        }
        return
      }

      await goToStep(stepIndex + 1, `Completed step: ${step.title}.`)
      return
    }

    if (step.kind === 'documents') {
      const missing = service.requiredDocuments.filter(
        (req) => !application!.documents.some((doc) => doc.requirementId === req.id),
      )
      if (missing.length > 0) {
        setDocumentsError(`Please upload: ${missing.map((m) => m.label).join(', ')}.`)
        return
      }
      setDocumentsError(undefined)
      await goToStep(stepIndex + 1, `Completed step: ${step.title}.`)
      return
    }

    if (step.kind === 'declaration') {
      if (!application!.declarationAccepted) {
        setDeclarationError('You must confirm the declaration before continuing.')
        return
      }
      setDeclarationError(undefined)
      await goToStep(stepIndex + 1, `Completed step: ${step.title}.`)
      return
    }

    if (step.kind === 'review') {
      await goToStep(stepIndex + 1)
    }
  }

  async function handleBack() {
    if (stepIndex === 0) return
    setIsSaving(true)
    try {
      await persist({ answers, currentStepIndex: stepIndex - 1 })
      setStepIndex(stepIndex - 1)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleSaveAndExit() {
    setIsExiting(true)
    try {
      await persist({ answers, currentStepIndex: stepIndex })
      navigate('/dashboard')
    } finally {
      setIsExiting(false)
    }
  }

  async function handleEdit(stepId: string) {
    const targetIndex = service.steps.findIndex((s) => s.id === stepId)
    if (targetIndex === -1) return
    if (stepId === 'eligibility') setEligibilityChecked(Boolean(application!.eligibilityResult))
    await persist({ answers, currentStepIndex: targetIndex })
    setStepIndex(targetIndex)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleUploadDocument(requirementId: string, file: File) {
    setUploadingRequirementId(requirementId)
    setDocumentsError(undefined)
    try {
      const updated = await applicationService.uploadDocument(application!.id, {
        requirementId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      })
      const newDocument = updated.documents[updated.documents.length - 1]
      await saveDocumentBlob(newDocument.id, file)
      setApplication(updated)
    } finally {
      setUploadingRequirementId(null)
    }
  }

  async function handleRemoveDocument(documentId: string) {
    const updated = await applicationService.removeDocument(application!.id, documentId)
    await deleteDocumentBlob(documentId)
    setApplication(updated)
  }

  async function handleDeclarationChange(accepted: boolean) {
    setDeclarationError(undefined)
    const now = new Date().toISOString()
    const updated = await applicationService.saveApplication(application!.id, {
      declarationAccepted: accepted,
      declarationAcceptedAt: accepted ? now : undefined,
    })
    if (accepted) {
      const withAudit = await applicationService.addAuditEvent(
        application!.id,
        application!.applicantEmail,
        'DECLARATION_ACCEPTED',
        'Applicant accepted the application declaration.',
      )
      setApplication(withAudit)
    } else {
      setApplication(updated)
    }
  }

  async function handleLoadDemoData() {
    setIsLoadingDemo(true)
    try {
      setAnswers((prev) => ({ ...prev, ...demoAnswers }))
      await persist({ answers: demoAnswers })
      for (const doc of demoDocuments) {
        const file = buildDemoFile(doc)
        // eslint-disable-next-line no-await-in-loop
        const updated = await applicationService.uploadDocument(application!.id, {
          requirementId: doc.requirementId,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
        })
        const newDocument = updated.documents[updated.documents.length - 1]
        // eslint-disable-next-line no-await-in-loop
        await saveDocumentBlob(newDocument.id, file)
        setApplication(updated)
      }
    } finally {
      setIsLoadingDemo(false)
    }
  }

  const personalFields = service.steps.find((s) => s.id === 'personal')?.fields ?? []
  const employmentFields = service.steps.find((s) => s.id === 'employment')?.fields ?? []
  const submitChecks = [
    {
      label: 'Personal and employment details completed',
      passed: Object.keys(validateStepFields([...personalFields, ...employmentFields], answers)).length === 0,
    },
    { label: 'Eligibility assessment completed', passed: Boolean(application!.eligibilityResult) },
    {
      label: 'Required documents uploaded',
      passed: service.requiredDocuments.every((req) =>
        application!.documents.some((doc) => doc.requirementId === req.id),
      ),
    },
    { label: 'Declaration accepted', passed: application!.declarationAccepted },
  ]

  async function handleSubmit() {
    setIsSubmitting(true)
    try {
      const updated = await applicationService.submitApplication(application!.id)
      setApplication(updated)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFirstStep = stepIndex === 0
  const isSubmitStep = step.kind === 'submit'
  const isEligibilityStep = step.kind === 'eligibility'
  const isBusy = isSaving || isExiting || isCheckingEligibility

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleSaveAndExit}
            disabled={isExiting}
            className="text-sm font-medium text-navy-800 hover:underline disabled:opacity-60"
          >
            &larr; Save and exit to dashboard
          </button>
          <span className="text-xs text-slate-400">
            Application {application.applicationNumber}
          </span>
        </div>

        <h1 className="mt-3 text-2xl font-semibold text-slate-900">{service.title}</h1>

        <div className="mt-6">
          <ProgressStepper steps={service.steps} currentIndex={stepIndex} />
        </div>

        {stepIndex === 0 && (
          <div className="mt-5">
            <button
              type="button"
              onClick={handleLoadDemoData}
              disabled={isLoadingDemo}
              className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-accent-500/50 bg-accent-100 px-3 py-2 text-sm font-medium text-accent-600 hover:bg-accent-100/70 disabled:opacity-60"
            >
              <Sparkles className="h-4 w-4" />
              {isLoadingDemo ? 'Loading demo application…' : 'Load demo application'}
            </button>
          </div>
        )}

        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">{step.title}</h2>
          <p className="mt-1 text-sm text-slate-600">{step.description}</p>

          <div className="mt-6">
            {step.kind === 'form' && (
              <FormStepFields
                fields={step.fields ?? []}
                answers={answers}
                errors={errors}
                onChange={handleFieldChange}
              />
            )}

            {step.kind === 'eligibility' && (
              <div className="space-y-6">
                <FormStepFields
                  fields={step.fields ?? []}
                  answers={answers}
                  errors={errors}
                  onChange={(id, value) => {
                    handleFieldChange(id, value)
                    setEligibilityChecked(false)
                  }}
                />
                {eligibilityChecked && application.eligibilityResult && (
                  <EligibilityResultPanel result={application.eligibilityResult} />
                )}
              </div>
            )}

            {step.kind === 'documents' && (
              <DocumentsStep
                requiredDocuments={service.requiredDocuments}
                documents={application.documents}
                uploadingRequirementId={uploadingRequirementId}
                onUpload={handleUploadDocument}
                onRemove={handleRemoveDocument}
                error={documentsError}
              />
            )}

            {step.kind === 'declaration' && (
              <DeclarationStep
                applicantName={application.applicantName}
                accepted={application.declarationAccepted}
                acceptedAt={application.declarationAcceptedAt}
                onChange={handleDeclarationChange}
                error={declarationError}
              />
            )}

            {step.kind === 'review' && (
              <ReviewStep service={service} application={application} answers={answers} onEdit={handleEdit} />
            )}

            {step.kind === 'submit' && (
              <SubmitStep checks={submitChecks} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            )}
          </div>
        </div>

        {savedNotice && (
          <div className="mt-4">
            <Alert tone="success">Your progress has been saved.</Alert>
          </div>
        )}

        {!isSubmitStep && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-3">
              <Button variant="secondary" onClick={handleBack} disabled={isFirstStep || isBusy}>
                Back
              </Button>
              <Button variant="ghost" onClick={handleSaveAndExit} loading={isExiting} disabled={isSaving}>
                Save and exit
              </Button>
            </div>
            <Button
              onClick={handleSaveAndContinue}
              loading={isSaving || (isEligibilityStep && isCheckingEligibility)}
              disabled={isExiting}
            >
              {isEligibilityStep && !eligibilityChecked ? 'Check eligibility & continue' : 'Save and continue'}
            </Button>
          </div>
        )}

        {isSubmitStep && (
          <div className="mt-6 flex gap-3">
            <Button variant="secondary" onClick={handleBack} disabled={isBusy || isSubmitting}>
              Back
            </Button>
            <Button variant="ghost" onClick={handleSaveAndExit} loading={isExiting} disabled={isSubmitting}>
              Save and exit
            </Button>
          </div>
        )}
      </div>
    </Layout>
  )
}
