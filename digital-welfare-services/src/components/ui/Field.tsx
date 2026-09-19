import type { FieldConfig } from '../../types'

interface FieldProps {
  field: FieldConfig
  value: string
  error?: string
  onChange: (value: string) => void
  onBlur?: () => void
}

const baseInputClasses =
  'w-full rounded-md border px-3 py-2.5 text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-600/40 focus:border-navy-600 disabled:bg-slate-100'

export function Field({ field, value, error, onChange, onBlur }: FieldProps) {
  const inputId = `field-${field.id}`
  const errorId = `${inputId}-error`
  const helpId = `${inputId}-help`
  const describedBy = [field.helpText ? helpId : null, error ? errorId : null]
    .filter(Boolean)
    .join(' ')
  const borderClass = error ? 'border-red-600' : 'border-slate-300'

  if (field.type === 'checkbox') {
    return (
      <div className="flex items-start gap-3">
        <input
          id={inputId}
          type="checkbox"
          checked={value === 'true'}
          onChange={(e) => onChange(e.target.checked ? 'true' : 'false')}
          onBlur={onBlur}
          className="mt-1 h-4 w-4 rounded border-slate-400 text-navy-900 focus:ring-navy-600"
          aria-describedby={describedBy || undefined}
          aria-invalid={Boolean(error)}
        />
        <label htmlFor={inputId} className="text-[15px] text-slate-800">
          {field.label}
        </label>
        {error && (
          <p id={errorId} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }

  if (field.type === 'radio') {
    return (
      <fieldset>
        <legend className="mb-2 block text-[15px] font-medium text-slate-900">
          {field.label}
          {field.validation?.required && <span aria-hidden="true" className="text-red-600"> *</span>}
        </legend>
        {field.helpText && (
          <p id={helpId} className="mb-2 text-sm text-slate-500">
            {field.helpText}
          </p>
        )}
        <div className="flex flex-wrap gap-3" role="radiogroup" aria-describedby={describedBy || undefined}>
          {field.options?.map((option) => {
            const optionId = `${inputId}-${option.value}`
            const checked = value === option.value
            return (
              <label
                key={option.value}
                htmlFor={optionId}
                className={`flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2.5 text-[15px] transition-colors ${
                  checked
                    ? 'border-navy-900 bg-navy-900/5 text-navy-900'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  id={optionId}
                  type="radio"
                  name={field.id}
                  value={option.value}
                  checked={checked}
                  onChange={() => onChange(option.value)}
                  onBlur={onBlur}
                  className="h-4 w-4 text-navy-900 focus:ring-navy-600"
                  aria-invalid={Boolean(error)}
                />
                {option.label}
              </label>
            )
          })}
        </div>
        {error && (
          <p id={errorId} className="mt-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </fieldset>
    )
  }

  return (
    <div>
      <label htmlFor={inputId} className="mb-1.5 block text-[15px] font-medium text-slate-900">
        {field.label}
        {field.validation?.required && <span aria-hidden="true" className="text-red-600"> *</span>}
      </label>
      {field.helpText && (
        <p id={helpId} className="mb-1.5 text-sm text-slate-500">
          {field.helpText}
        </p>
      )}

      {field.type === 'select' ? (
        <select
          id={inputId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={`${baseInputClasses} ${borderClass} bg-white`}
          aria-describedby={describedBy || undefined}
          aria-invalid={Boolean(error)}
        >
          <option value="">Select an option</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : field.type === 'textarea' ? (
        <textarea
          id={inputId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={field.placeholder}
          rows={3}
          className={`${baseInputClasses} ${borderClass}`}
          aria-describedby={describedBy || undefined}
          aria-invalid={Boolean(error)}
        />
      ) : (
        <input
          id={inputId}
          type={field.type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={field.placeholder}
          className={`${baseInputClasses} ${borderClass}`}
          aria-describedby={describedBy || undefined}
          aria-invalid={Boolean(error)}
          max={field.type === 'date' ? new Date().toISOString().slice(0, 10) : undefined}
        />
      )}

      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
