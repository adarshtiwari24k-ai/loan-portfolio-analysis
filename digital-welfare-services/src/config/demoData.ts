// Sample answers used by the "Load demo application" button, matching the
// employment-support service's field ids so the full journey can be
// demonstrated end-to-end without hand-typing every field.
export const demoAnswers: Record<string, string> = {
  fullName: 'Alex Morgan',
  dob: '1992-03-15',
  ppsNumber: '1234567T',
  address: '14 Riverside Walk, Dublin, D08 X2R4',
  email: 'alex.morgan@example.demo',
  phone: '+353 87 123 4567',
  employmentStatus: 'unemployed',
  previousEmployer: 'Acme Manufacturing Ltd',
  lastEmploymentDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  monthlyIncome: '1800',
  otherIncome: '0',
  lostEmployment: 'yes',
  availableForWork: 'yes',
  legalResident: 'yes',
}

export const demoDocuments: { requirementId: string; fileName: string; content: string; type: string }[] = [
  {
    requirementId: 'identity',
    fileName: 'identity.pdf',
    content: 'Demo identity document placeholder content for the Digital Welfare Services prototype.',
    type: 'application/pdf',
  },
  {
    requirementId: 'employment',
    fileName: 'employment-letter.pdf',
    content: 'Demo employment evidence placeholder content for the Digital Welfare Services prototype.',
    type: 'application/pdf',
  },
  {
    requirementId: 'income',
    fileName: 'bank-statement.pdf',
    content: 'Demo income evidence placeholder content for the Digital Welfare Services prototype.',
    type: 'application/pdf',
  },
]

export function buildDemoFile(doc: (typeof demoDocuments)[number]): File {
  return new File([doc.content], doc.fileName, { type: doc.type })
}
