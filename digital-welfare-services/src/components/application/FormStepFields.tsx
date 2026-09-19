import type { FieldConfig } from '../../types'
import { Field } from '../ui/Field'

interface FormStepFieldsProps {
  fields: FieldConfig[]
  answers: Record<string, string>
  errors: Record<string, string>
  onChange: (fieldId: string, value: string) => void
}

export function FormStepFields({ fields, answers, errors, onChange }: FormStepFieldsProps) {
  return (
    <div className="space-y-5">
      {fields
        .filter((field) => !field.showIf || field.showIf(answers))
        .map((field) => (
          <Field
            key={field.id}
            field={field}
            value={answers[field.id] ?? ''}
            error={errors[field.id]}
            onChange={(value) => onChange(field.id, value)}
          />
        ))}
    </div>
  )
}
