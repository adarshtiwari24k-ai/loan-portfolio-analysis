import type { ReactNode } from 'react'
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react'

type Tone = 'info' | 'success' | 'warning'

const toneStyles: Record<Tone, { border: string; bg: string; icon: ReactNode; iconColor: string }> = {
  info: {
    border: 'border-navy-900/20',
    bg: 'bg-navy-900/5',
    icon: <Info className="h-5 w-5" />,
    iconColor: 'text-navy-800',
  },
  success: {
    border: 'border-accent-500/30',
    bg: 'bg-accent-100',
    icon: <CheckCircle2 className="h-5 w-5" />,
    iconColor: 'text-accent-600',
  },
  warning: {
    border: 'border-amber-600/30',
    bg: 'bg-amber-100',
    icon: <AlertTriangle className="h-5 w-5" />,
    iconColor: 'text-amber-600',
  },
}

export function Alert({
  tone = 'info',
  title,
  children,
}: {
  tone?: Tone
  title?: string
  children: ReactNode
}) {
  const style = toneStyles[tone]
  return (
    <div className={`flex gap-3 rounded-md border ${style.border} ${style.bg} px-4 py-3`} role="status">
      <span className={`mt-0.5 shrink-0 ${style.iconColor}`}>{style.icon}</span>
      <div className="text-sm text-slate-700">
        {title && <p className="font-medium text-slate-900">{title}</p>}
        <div className={title ? 'mt-0.5' : ''}>{children}</div>
      </div>
    </div>
  )
}
