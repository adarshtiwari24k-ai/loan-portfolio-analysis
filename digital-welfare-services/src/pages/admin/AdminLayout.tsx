import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { Logo } from '../../components/ui/Logo'

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-navy-950 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="rounded-sm">
              <Logo variant="light" />
            </Link>
            <span className="hidden items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium sm:flex">
              <ShieldCheck className="h-3.5 w-3.5" /> Officer portal
            </span>
          </div>
          <Link to="/" className="text-sm font-medium text-slate-200 hover:text-white hover:underline">
            Exit to citizen site
          </Link>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
