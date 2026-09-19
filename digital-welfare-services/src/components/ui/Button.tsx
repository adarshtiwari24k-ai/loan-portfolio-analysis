import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'md' | 'lg' | 'sm'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  fullWidth?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-navy-900 text-white hover:bg-navy-800 disabled:bg-slate-300 disabled:text-slate-500',
  secondary:
    'bg-white text-navy-900 border border-navy-900 hover:bg-slate-100 disabled:border-slate-300 disabled:text-slate-400',
  ghost:
    'bg-transparent text-navy-900 hover:bg-slate-100 disabled:text-slate-400',
  danger:
    'bg-red-600 text-white hover:bg-red-700 disabled:bg-slate-300 disabled:text-slate-500',
}

const sizeClasses: Record<Size, string> = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-[15px] px-4 py-2.5',
  lg: 'text-base px-6 py-3',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, fullWidth = false, disabled, className = '', children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors cursor-pointer disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
})
