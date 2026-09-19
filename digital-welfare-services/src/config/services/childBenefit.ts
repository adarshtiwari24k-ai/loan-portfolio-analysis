import type { ServiceDefinition } from '../../types'

// Catalogue entry only - see housingSupport.ts for rationale.
export const childBenefitService: ServiceDefinition = {
  id: 'child-benefit',
  title: 'Child Benefit',
  summary: 'A monthly payment to support families with children.',
  category: 'Family',
  processingTime: 'Typically 15-20 working days',
  fullyFunctional: false,
  requiredDocuments: [
    { id: 'identity', label: 'Proof of identity', description: 'A passport or national ID card.' },
    { id: 'birth-cert', label: "Child's birth certificate", description: 'Official birth certificate or equivalent record.' },
    { id: 'residency', label: 'Proof of residency', description: 'Utility bill or tenancy agreement.' },
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
      id: 'children',
      title: 'Child details',
      description: 'Tell us about the children in your care.',
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
