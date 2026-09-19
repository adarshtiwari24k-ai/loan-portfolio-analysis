import type { ReactNode } from 'react'

type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'

interface BadgeProps {
  tone?: Tone
  children: ReactNode
  className?: string
}

const toneClasses: Record<Tone, string> = {
  neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  info: 'bg-navy-900/5 text-navy-900 border-navy-900/15',
  success: 'bg-accent-100 text-accent-600 border-accent-500/25',
  warning: 'bg-amber-100 text-amber-600 border-amber-600/25',
  danger: 'bg-red-100 text-red-600 border-red-600/25',
}

export function Badge({ tone = 'neutral', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${toneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
