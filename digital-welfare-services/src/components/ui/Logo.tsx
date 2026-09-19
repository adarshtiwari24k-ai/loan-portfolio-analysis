interface LogoProps {
  className?: string
  variant?: 'dark' | 'light'
}

export function Logo({ className = '', variant = 'dark' }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect x="1" y="1" width="28" height="28" rx="6" fill="#0f2547" />
        <path d="M15 6L24 11V13H6V11L15 6Z" fill="#f7f8fa" />
        <rect x="8" y="14" width="2.6" height="9" fill="#f7f8fa" />
        <rect x="13.7" y="14" width="2.6" height="9" fill="#f7f8fa" />
        <rect x="19.4" y="14" width="2.6" height="9" fill="#f7f8fa" />
        <rect x="6" y="23.5" width="18" height="2" fill="#0e9481" />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className={`text-[15px] font-semibold tracking-tight ${
            variant === 'light' ? 'text-white' : 'text-slate-900'
          }`}
        >
          Digital Welfare Services
        </span>
      </span>
    </span>
  )
}
