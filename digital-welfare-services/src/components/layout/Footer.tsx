import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">Digital Welfare Services</p>
            <p className="mt-1 text-sm text-slate-500">
              MyWelfare-style Government Digital Service Prototype
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Explore</p>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-500">
              <li><Link to="/services" className="hover:text-navy-800 hover:underline">Services</Link></li>
              <li><Link to="/my-applications" className="hover:text-navy-800 hover:underline">My Applications</Link></li>
              <li><Link to="/architecture" className="hover:text-navy-800 hover:underline">How the platform works</Link></li>
              <li><Link to="/admin" className="hover:text-navy-800 hover:underline">Officer portal</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">About this prototype</p>
            <p className="mt-2 text-sm text-slate-500">
              This is an educational demonstration inspired by publicly documented information about
              Ireland&apos;s MyWelfare service. It is not affiliated with, and does not represent, any
              government department or its suppliers. No real personal data is collected or transmitted.
            </p>
          </div>
        </div>
        <p className="mt-8 border-t border-slate-200 pt-6 text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Digital Welfare Services prototype. All data in this demo is
          stored locally in your browser only.
        </p>
      </div>
    </footer>
  )
}
