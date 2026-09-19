import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Bell, LogOut, Menu, ShieldCheck, X } from 'lucide-react'
import { Logo } from '../ui/Logo'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationContext'
import { NotificationPanel } from './NotificationPanel'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services', end: false },
  { to: '/my-applications', label: 'My Applications', end: false },
  { to: '/help', label: 'Help', end: false },
]

export function Header() {
  const { user, signOut } = useAuth()
  const { unreadCount } = useNotifications()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="bg-navy-950 px-4 py-1.5 text-center text-xs text-slate-200 sm:px-6">
        Government digital services &mdash; MyWelfare-style prototype, not a live service
      </div>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="rounded-sm" aria-label="Digital Welfare Services home">
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `block rounded-md px-3 py-2 text-[15px] font-medium ${
                      isActive ? 'bg-slate-100 text-navy-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotifOpen((v) => !v)}
                  className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100"
                  aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
                  aria-expanded={notifOpen}
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
              </div>
              <span className="text-sm text-slate-600">
                {user.name.split(' ')[0]}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/admin"
                className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100"
              >
                <ShieldCheck className="h-4 w-4" /> Officer portal
              </Link>
              <Link
                to="/login"
                className="rounded-md bg-navy-900 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800"
              >
                Sign in
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md text-slate-700 md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-md px-3 py-2.5 text-[15px] font-medium ${
                      isActive ? 'bg-slate-100 text-navy-900' : 'text-slate-600'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-3 border-t border-slate-200 pt-3">
            {user ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-1.5 rounded-md px-3 py-2.5 text-[15px] font-medium text-slate-600"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md bg-navy-900 px-3 py-2.5 text-center text-[15px] font-medium text-white"
                >
                  Sign in
                </Link>
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 block rounded-md px-3 py-2.5 text-center text-[15px] font-medium text-slate-500"
                >
                  Officer portal
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
