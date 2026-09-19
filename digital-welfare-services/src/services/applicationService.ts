import type {
  ApplicationStatus,
  AuditEvent,
  DocumentMeta,
  ProcessingRoute,
  WelfareApplication,
} from '../types'
import { generateApplicationNumber, generateId } from '../lib/ids'
import { getServiceById } from '../config/services'
import { networkDelay, readList, writeList } from './storage'
import { notificationService } from './notificationService'

const APPLICATIONS_KEY = 'applications'

function readAll(): WelfareApplication[] {
  return readList<WelfareApplication>(APPLICATIONS_KEY)
}

function writeAll(applications: WelfareApplication[]): void {
  writeList(APPLICATIONS_KEY, applications)
}

function buildAuditEvent(actor: string, action: string, description: string): AuditEvent {
  return {
    id: generateId('audit'),
    timestamp: new Date().toISOString(),
    actor,
    action,
    description,
  }
}

export const applicationService = {
  async listByUser(userEmail: string): Promise<WelfareApplication[]> {
    await networkDelay(250)
    return readAll()
      .filter((app) => app.applicantEmail === userEmail)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  },

  async listAll(): Promise<WelfareApplication[]> {
    await networkDelay(300)
    return readAll().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  },

  async getApplication(id: string): Promise<WelfareApplication | null> {
    await networkDelay(200)
    return readAll().find((app) => app.id === id) ?? null
  },

  /** Returns the most recent draft (or any) application for this user + service, if one exists. */
  async findExisting(userEmail: string, serviceId: string): Promise<WelfareApplication | null> {
    await networkDelay(150)
    const matches = readAll()
      .filter((app) => app.applicantEmail === userEmail && app.serviceId === serviceId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    return matches[0] ?? null
  },

  async createApplication(input: {
    serviceId: string
    applicantEmail: string
    applicantName: string
  }): Promise<WelfareApplication> {
    await networkDelay(350)
    const now = new Date().toISOString()
    const application: WelfareApplication = {
      id: generateId('app'),
      applicationNumber: generateApplicationNumber(),
      serviceId: input.serviceId,
      applicantEmail: input.applicantEmail,
      applicantName: input.applicantName,
      answers: {},
      documents: [],
      declarationAccepted: false,
      currentStepIndex: 0,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      auditEvents: [
        buildAuditEvent(input.applicantEmail, 'APPLICATION_CREATED', 'Application draft created.'),
      ],
    }
    const all = readAll()
    all.push(application)
    writeAll(all)
    return application
  },

  async saveApplication(
    id: string,
    updates: Partial<
      Pick<
        WelfareApplication,
        'answers' | 'currentStepIndex' | 'declarationAccepted' | 'declarationAcceptedAt'
      >
    >,
  ): Promise<WelfareApplication> {
    await networkDelay(300)
    const all = readAll()
    const index = all.findIndex((app) => app.id === id)
    if (index === -1) throw new Error('Application not found.')
    const updated: WelfareApplication = {
      ...all[index],
      ...updates,
      answers: updates.answers ? { ...all[index].answers, ...updates.answers } : all[index].answers,
      updatedAt: new Date().toISOString(),
    }
    all[index] = updated
    writeAll(all)
    return updated
  },

  async addAuditEvent(id: string, actor: string, action: string, description: string): Promise<WelfareApplication> {
    const all = readAll()
    const index = all.findIndex((app) => app.id === id)
    if (index === -1) throw new Error('Application not found.')
    const event = buildAuditEvent(actor, action, description)
    const updated: WelfareApplication = {
      ...all[index],
      auditEvents: [...all[index].auditEvents, event],
      updatedAt: new Date().toISOString(),
    }
    all[index] = updated
    writeAll(all)
    return updated
  },

  async uploadDocument(
    id: string,
    document: Omit<DocumentMeta, 'id' | 'uploadedAt' | 'status'>,
  ): Promise<WelfareApplication> {
    await networkDelay(500)
    const all = readAll()
    const index = all.findIndex((app) => app.id === id)
    if (index === -1) throw new Error('Application not found.')
    const meta: DocumentMeta = {
      ...document,
      id: generateId('doc'),
      uploadedAt: new Date().toISOString(),
      status: 'uploaded',
    }
    const event = buildAuditEvent(
      all[index].applicantEmail,
      'DOCUMENT_ADDED',
      `Uploaded "${document.fileName}" for ${document.requirementId}.`,
    )
    const updated: WelfareApplication = {
      ...all[index],
      documents: [...all[index].documents, meta],
      auditEvents: [...all[index].auditEvents, event],
      updatedAt: new Date().toISOString(),
    }
    all[index] = updated
    writeAll(all)
    return updated
  },

  async removeDocument(id: string, documentId: string): Promise<WelfareApplication> {
    await networkDelay(200)
    const all = readAll()
    const index = all.findIndex((app) => app.id === id)
    if (index === -1) throw new Error('Application not found.')
    const doc = all[index].documents.find((d) => d.id === documentId)
    const event = buildAuditEvent(
      all[index].applicantEmail,
      'DOCUMENT_REMOVED',
      doc ? `Removed "${doc.fileName}".` : 'Removed a document.',
    )
    const updated: WelfareApplication = {
      ...all[index],
      documents: all[index].documents.filter((d) => d.id !== documentId),
      auditEvents: [...all[index].auditEvents, event],
      updatedAt: new Date().toISOString(),
    }
    all[index] = updated
    writeAll(all)
    return updated
  },

  async evaluateEligibility(id: string): Promise<WelfareApplication> {
    await networkDelay(400)
    const all = readAll()
    const index = all.findIndex((app) => app.id === id)
    if (index === -1) throw new Error('Application not found.')
    const application = all[index]
    const service = getServiceById(application.serviceId)
    const result = service?.evaluateEligibility?.(application.answers) ?? {
      outcome: 'requires-review' as const,
      reasons: ['This service does not have an automated eligibility check configured.'],
      evaluatedAt: new Date().toISOString(),
    }
    const event = buildAuditEvent(
      'system',
      'ELIGIBILITY_CHECKED',
      `Initial eligibility assessment: ${result.outcome === 'potentially-eligible' ? 'Potentially eligible' : 'Requires review'}.`,
    )
    const updated: WelfareApplication = {
      ...application,
      eligibilityResult: result,
      auditEvents: [...application.auditEvents, event],
      updatedAt: new Date().toISOString(),
    }
    all[index] = updated
    writeAll(all)
    return updated
  },

  async submitApplication(id: string): Promise<WelfareApplication> {
    await networkDelay(700)
    const all = readAll()
    const index = all.findIndex((app) => app.id === id)
    if (index === -1) throw new Error('Application not found.')
    const application = all[index]
    const service = getServiceById(application.serviceId)

    const eligibilityResult =
      application.eligibilityResult ?? service?.evaluateEligibility?.(application.answers)

    const route: ProcessingRoute = {
      route: eligibilityResult?.outcome === 'potentially-eligible' ? 'automatic' : 'manual',
      reason:
        eligibilityResult?.outcome === 'potentially-eligible'
          ? 'All demonstration eligibility conditions were met on first submission.'
          : 'One or more demonstration eligibility conditions require officer attention.',
      decidedAt: new Date().toISOString(),
    }

    const now = new Date().toISOString()
    const events = [
      ...application.auditEvents,
      buildAuditEvent(application.applicantEmail, 'APPLICATION_SUBMITTED', 'Application submitted for processing.'),
      buildAuditEvent(
        'system',
        'PROCESSING_ROUTE_DETERMINED',
        route.route === 'automatic'
          ? 'Routed as an automatic processing candidate.'
          : 'Routed for manual officer review.',
      ),
    ]

    const updated: WelfareApplication = {
      ...application,
      status: 'eligibility-assessment',
      eligibilityResult,
      processingRoute: route,
      submittedAt: now,
      updatedAt: now,
      auditEvents: events,
    }
    all[index] = updated
    writeAll(all)

    await notificationService.create({
      userEmail: application.applicantEmail,
      title: 'Application submitted',
      body: `Your application ${application.applicationNumber} has been submitted and is now being assessed.`,
      applicationId: application.id,
    })

    return updated
  },

  async updateStatus(
    id: string,
    status: ApplicationStatus,
    actor: string,
    action: string,
    description: string,
  ): Promise<WelfareApplication> {
    await networkDelay(400)
    const all = readAll()
    const index = all.findIndex((app) => app.id === id)
    if (index === -1) throw new Error('Application not found.')
    const application = all[index]
    const event = buildAuditEvent(actor, action, description)
    const updated: WelfareApplication = {
      ...application,
      status,
      auditEvents: [...application.auditEvents, event],
      updatedAt: new Date().toISOString(),
    }
    all[index] = updated
    writeAll(all)
    return updated
  },

  async assignOfficer(id: string, officerName: string): Promise<WelfareApplication> {
    await networkDelay(250)
    const all = readAll()
    const index = all.findIndex((app) => app.id === id)
    if (index === -1) throw new Error('Application not found.')
    const event = buildAuditEvent('system', 'OFFICER_ASSIGNED', `Assigned to ${officerName}.`)
    const updated: WelfareApplication = {
      ...all[index],
      assignedOfficer: officerName,
      auditEvents: [...all[index].auditEvents, event],
      updatedAt: new Date().toISOString(),
    }
    all[index] = updated
    writeAll(all)
    return updated
  },
}

export function getApplicationStatusLabel(status: ApplicationStatus): string {
  switch (status) {
    case 'draft':
      return 'In progress'
    case 'submitted':
      return 'Submitted'
    case 'eligibility-assessment':
      return 'Eligibility assessment'
    case 'officer-review':
      return 'Officer review'
    case 'information-requested':
      return 'Additional information requested'
    case 'approved':
      return 'Approved'
    case 'rejected':
      return 'Not approved'
    default:
      return status
  }
}
