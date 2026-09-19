import type { WelfareApplication } from '../types'
import { applicationService } from './applicationService'
import { notificationService } from './notificationService'

const OFFICER_NAME = 'Officer J. Ryan'

async function notifyCitizen(application: WelfareApplication, title: string, body: string) {
  await notificationService.create({
    userEmail: application.applicantEmail,
    title,
    body,
    applicationId: application.id,
  })
}

export const caseService = {
  officerName: OFFICER_NAME,

  async startReview(applicationId: string): Promise<WelfareApplication> {
    const application = await applicationService.updateStatus(
      applicationId,
      'officer-review',
      OFFICER_NAME,
      'OFFICER_REVIEW_STARTED',
      `${OFFICER_NAME} started reviewing this application.`,
    )
    await applicationService.assignOfficer(applicationId, OFFICER_NAME)
    return application
  },

  async requestInformation(applicationId: string, note: string): Promise<WelfareApplication> {
    const application = await applicationService.updateStatus(
      applicationId,
      'information-requested',
      OFFICER_NAME,
      'DOCUMENT_REQUESTED',
      note.trim().length > 0 ? note.trim() : 'Additional information requested from the applicant.',
    )
    await notifyCitizen(
      application,
      'Additional information required',
      `${OFFICER_NAME} has requested additional information for application ${application.applicationNumber}.`,
    )
    return application
  },

  async sendToManualReview(applicationId: string): Promise<WelfareApplication> {
    const application = await applicationService.updateStatus(
      applicationId,
      'officer-review',
      OFFICER_NAME,
      'MANUAL_REVIEW_REQUESTED',
      'Application flagged for full manual review.',
    )
    return application
  },

  async approve(applicationId: string): Promise<WelfareApplication> {
    const application = await applicationService.updateStatus(
      applicationId,
      'approved',
      OFFICER_NAME,
      'APPLICATION_APPROVED',
      `${OFFICER_NAME} approved this application.`,
    )
    await notifyCitizen(
      application,
      'Application approved',
      `Your application ${application.applicationNumber} has been approved.`,
    )
    return application
  },

  async reject(applicationId: string, reason: string): Promise<WelfareApplication> {
    const application = await applicationService.updateStatus(
      applicationId,
      'rejected',
      OFFICER_NAME,
      'APPLICATION_REJECTED',
      reason.trim().length > 0 ? reason.trim() : 'Application was not approved.',
    )
    await notifyCitizen(
      application,
      'Application decision',
      `Your application ${application.applicationNumber} was not approved. See the application for details.`,
    )
    return application
  },
}
