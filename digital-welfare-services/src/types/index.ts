// Core domain types for the Digital Welfare Services prototype.
// These model an in-progress or submitted benefit application, the
// configurable service catalogue, and the audit/notification trail.

export type FieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'date'
  | 'select'
  | 'radio'
  | 'textarea'
  | 'number'
  | 'checkbox'

export interface SelectOption {
  value: string
  label: string
}

export interface FieldValidation {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  patternMessage?: string
  min?: number
  max?: number
  custom?: (value: string, answers: Record<string, string>) => string | undefined
}

export interface FieldConfig {
  id: string
  label: string
  type: FieldType
  placeholder?: string
  helpText?: string
  options?: SelectOption[]
  validation?: FieldValidation
  // Only render this field if the predicate over current answers returns true.
  showIf?: (answers: Record<string, string>) => boolean
}

export type StepKind =
  | 'form'
  | 'eligibility'
  | 'documents'
  | 'declaration'
  | 'review'
  | 'submit'

export interface StepConfig {
  id: string
  title: string
  description: string
  kind: StepKind
  fields?: FieldConfig[]
}

export interface RequiredDocumentConfig {
  id: string
  label: string
  description: string
}

export interface EligibilityRuleResult {
  outcome: 'potentially-eligible' | 'requires-review'
  reasons: string[]
  evaluatedAt: string
}

export interface ServiceDefinition {
  id: string
  title: string
  summary: string
  category: string
  processingTime: string
  steps: StepConfig[]
  requiredDocuments: RequiredDocumentConfig[]
  fullyFunctional: boolean
  evaluateEligibility?: (answers: Record<string, string>) => EligibilityRuleResult
}

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'eligibility-assessment'
  | 'officer-review'
  | 'information-requested'
  | 'approved'
  | 'rejected'

export interface DocumentMeta {
  id: string
  requirementId: string
  fileName: string
  fileSize: number
  fileType: string
  uploadedAt: string
  status: 'uploaded'
}

export interface AuditEvent {
  id: string
  timestamp: string
  actor: string
  action: string
  description: string
}

export interface ProcessingRoute {
  route: 'automatic' | 'manual'
  reason: string
  decidedAt: string
}

export interface WelfareApplication {
  id: string
  applicationNumber: string
  serviceId: string
  applicantEmail: string
  applicantName: string
  answers: Record<string, string>
  documents: DocumentMeta[]
  declarationAccepted: boolean
  declarationAcceptedAt?: string
  currentStepIndex: number
  status: ApplicationStatus
  eligibilityResult?: EligibilityRuleResult
  processingRoute?: ProcessingRoute
  assignedOfficer?: string
  createdAt: string
  updatedAt: string
  submittedAt?: string
  auditEvents: AuditEvent[]
}

export interface AppNotification {
  id: string
  userEmail: string
  title: string
  body: string
  createdAt: string
  read: boolean
  applicationId?: string
}

export interface AuthenticatedUser {
  name: string
  email: string
  ppsNumber: string
  method: 'digital-id' | 'demo'
  verified: boolean
}
