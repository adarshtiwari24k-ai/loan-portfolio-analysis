import type { FieldConfig } from '../types'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^\+?[0-9][0-9 ()-]{7,15}$/
// Fictional national ID format used only for this demo: 7 digits + 1-2 letters.
const PPS_PATTERN = /^\d{7}[A-Za-z]{1,2}$/

export const patterns = {
  email: EMAIL_PATTERN,
  phone: PHONE_PATTERN,
  ppsNumber: PPS_PATTERN,
}

export function validateField(
  field: FieldConfig,
  rawValue: string | undefined,
  answers: Record<string, string>,
): string | undefined {
  const value = (rawValue ?? '').trim()
  const rules = field.validation

  if (!rules) return undefined

  if (rules.required && value.length === 0) {
    return `${field.label} is required.`
  }

  if (value.length === 0) {
    // Optional and empty: skip further checks.
    return undefined
  }

  if (rules.minLength && value.length < rules.minLength) {
    return `${field.label} must be at least ${rules.minLength} characters.`
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    return `${field.label} must be no more than ${rules.maxLength} characters.`
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    return rules.patternMessage ?? `${field.label} is not in a valid format.`
  }

  if (field.type === 'number' || field.type === 'date') {
    const numeric = field.type === 'number' ? Number.parseFloat(value) : Number.NaN
    if (field.type === 'number') {
      if (Number.isNaN(numeric)) return `${field.label} must be a number.`
      if (rules.min !== undefined && numeric < rules.min) {
        return `${field.label} must be at least ${rules.min}.`
      }
      if (rules.max !== undefined && numeric > rules.max) {
        return `${field.label} must be no more than ${rules.max}.`
      }
    }
    if (field.type === 'date') {
      const parsed = new Date(value)
      if (Number.isNaN(parsed.getTime())) {
        return `${field.label} must be a valid date.`
      }
      if (parsed.getTime() > Date.now()) {
        return `${field.label} cannot be in the future.`
      }
    }
  }

  if (rules.custom) {
    return rules.custom(value, answers)
  }

  return undefined
}

export function validateStepFields(
  fields: FieldConfig[],
  answers: Record<string, string>,
): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const field of fields) {
    if (field.showIf && !field.showIf(answers)) continue
    const error = validateField(field, answers[field.id], answers)
    if (error) errors[field.id] = error
  }
  return errors
}
