import type { ServiceDefinition, WelfareApplication } from '../types'

export function getProgressPercent(application: WelfareApplication, service: ServiceDefinition | undefined): number {
  if (!service || service.steps.length <= 1) return application.status === 'draft' ? 0 : 100
  if (application.status !== 'draft') return 100
  const percent = Math.round((application.currentStepIndex / (service.steps.length - 1)) * 100)
  return Math.min(100, Math.max(0, percent))
}
