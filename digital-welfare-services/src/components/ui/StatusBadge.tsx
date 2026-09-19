import type { ApplicationStatus } from '../../types'
import { getApplicationStatusLabel } from '../../services/applicationService'
import { Badge } from './Badge'

const toneByStatus: Record<ApplicationStatus, 'neutral' | 'info' | 'success' | 'warning' | 'danger'> = {
  draft: 'neutral',
  submitted: 'info',
  'eligibility-assessment': 'info',
  'officer-review': 'warning',
  'information-requested': 'warning',
  approved: 'success',
  rejected: 'danger',
}

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return <Badge tone={toneByStatus[status]}>{getApplicationStatusLabel(status)}</Badge>
}
