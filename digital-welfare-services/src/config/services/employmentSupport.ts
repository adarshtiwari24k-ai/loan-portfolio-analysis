import type { ServiceDefinition } from '../../types'
import { evaluateEmploymentSupportEligibility } from '../rulesEngine'
import { patterns } from '../../lib/validation'

export const employmentSupportService: ServiceDefinition = {
  id: 'employment-support',
  title: 'Employment Support Benefit',
  summary:
    'Financial support for people who have recently lost employment and are available for work.',
  category: 'Employment',
  processingTime: 'Typically 5-10 working days',
  fullyFunctional: true,
  evaluateEligibility: evaluateEmploymentSupportEligibility,
  requiredDocuments: [
    {
      id: 'identity',
      label: 'Proof of identity',
      description: 'A passport, driving licence, or national ID card.',
    },
    {
      id: 'employment',
      label: 'Employment evidence',
      description: 'A termination letter, redundancy notice, or final payslip.',
    },
    {
      id: 'income',
      label: 'Income evidence',
      description: 'Recent bank statement or payslip showing current income.',
    },
  ],
  steps: [
    {
      id: 'personal',
      title: 'Personal details',
      description: 'Tell us who you are so we can identify your application.',
      kind: 'form',
      fields: [
        {
          id: 'fullName',
          label: 'Full name',
          type: 'text',
          placeholder: 'e.g. Alex Morgan',
          validation: { required: true, minLength: 2, maxLength: 100 },
        },
        {
          id: 'dob',
          label: 'Date of birth',
          type: 'date',
          validation: { required: true },
        },
        {
          id: 'ppsNumber',
          label: 'National ID / PPS number',
          type: 'text',
          placeholder: 'e.g. 1234567T',
          helpText: 'Fictional demo format: 7 digits followed by 1-2 letters.',
          validation: {
            required: true,
            pattern: patterns.ppsNumber,
            patternMessage: 'Enter a valid ID in the format 1234567T.',
          },
        },
        {
          id: 'address',
          label: 'Home address',
          type: 'textarea',
          placeholder: 'Street, town, county, eircode/postcode',
          validation: { required: true, minLength: 8, maxLength: 250 },
        },
        {
          id: 'email',
          label: 'Email address',
          type: 'email',
          placeholder: 'e.g. alex.morgan@example.com',
          validation: {
            required: true,
            pattern: patterns.email,
            patternMessage: 'Enter a valid email address.',
          },
        },
        {
          id: 'phone',
          label: 'Phone number',
          type: 'tel',
          placeholder: 'e.g. +353 87 123 4567',
          validation: {
            required: true,
            pattern: patterns.phone,
            patternMessage: 'Enter a valid phone number.',
          },
        },
      ],
    },
    {
      id: 'employment',
      title: 'Employment & income',
      description: 'Tell us about your current employment situation and income.',
      kind: 'form',
      fields: [
        {
          id: 'employmentStatus',
          label: 'Employment status',
          type: 'select',
          options: [
            { value: 'employed', label: 'Employed' },
            { value: 'unemployed', label: 'Unemployed' },
            { value: 'self-employed', label: 'Self-employed' },
          ],
          validation: { required: true },
        },
        {
          id: 'previousEmployer',
          label: 'Previous employer',
          type: 'text',
          placeholder: 'e.g. Acme Manufacturing Ltd',
          validation: { required: true, minLength: 2, maxLength: 120 },
        },
        {
          id: 'lastEmploymentDate',
          label: 'Last employment date',
          type: 'date',
          validation: { required: true },
        },
        {
          id: 'monthlyIncome',
          label: 'Current monthly income (€)',
          type: 'number',
          placeholder: 'e.g. 1800',
          helpText: 'Enter 0 if you currently have no income.',
          validation: { required: true, min: 0, max: 100000 },
        },
        {
          id: 'otherIncome',
          label: 'Other monthly income (€)',
          type: 'number',
          placeholder: 'e.g. 0',
          helpText: 'Include any other regular income, such as rental income. Enter 0 if none.',
          validation: { required: true, min: 0, max: 100000 },
        },
      ],
    },
    {
      id: 'eligibility',
      title: 'Eligibility questions',
      description:
        'Answer these questions so we can give you an initial eligibility assessment. This is not a final decision.',
      kind: 'eligibility',
      fields: [
        {
          id: 'lostEmployment',
          label: 'Have you lost employment within the last 30 days?',
          type: 'radio',
          options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ],
          validation: { required: true },
        },
        {
          id: 'availableForWork',
          label: 'Are you currently available for work?',
          type: 'radio',
          options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ],
          validation: { required: true },
        },
        {
          id: 'legalResident',
          label: 'Are you legally resident in the country?',
          type: 'radio',
          options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ],
          validation: { required: true },
        },
      ],
    },
    {
      id: 'documents',
      title: 'Document upload',
      description: 'Upload the supporting documents for your application.',
      kind: 'documents',
    },
    {
      id: 'declaration',
      title: 'Declaration',
      description: 'Confirm that the information you have provided is accurate.',
      kind: 'declaration',
    },
    {
      id: 'review',
      title: 'Review your application',
      description: 'Check everything is correct before you submit.',
      kind: 'review',
    },
    {
      id: 'submit',
      title: 'Submit application',
      description: 'Submit your application for processing.',
      kind: 'submit',
    },
  ],
}
