import type { ServiceDefinition } from '../../types'

// Catalogue entry only, to demonstrate that the same application engine can
// render additional services from configuration. Not wired up with a full
// working step flow in this prototype.
export const housingSupportService: ServiceDefinition = {
  id: 'housing-support',
  title: 'Housing Support',
  summary: 'Assistance towards rent or housing costs for eligible households.',
  category: 'Housing',
  processingTime: 'Typically 10-15 working days',
  fullyFunctional: false,
  requiredDocuments: [
    { id: 'identity', label: 'Proof of identity', description: 'A passport or national ID card.' },
    { id: 'tenancy', label: 'Tenancy agreement', description: 'Current signed lease or tenancy agreement.' },
    { id: 'income', label: 'Income evidence', description: 'Recent payslips or bank statements.' },
  ],
  steps: [
    {
      id: 'personal',
      title: 'Personal details',
      description: 'Tell us who you are.',
      kind: 'form',
      fields: [],
    },
    {
      id: 'household',
      title: 'Household & tenancy',
      description: 'Tell us about your household and current housing costs.',
      kind: 'form',
      fields: [],
    },
    {
      id: 'documents',
      title: 'Document upload',
      description: 'Upload supporting documents.',
      kind: 'documents',
    },
    {
      id: 'review',
      title: 'Review your application',
      description: 'Check everything is correct before you submit.',
      kind: 'review',
    },
  ],
}
