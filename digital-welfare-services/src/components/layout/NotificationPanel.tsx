import { useEffect, useRef } from 'react'
import { useNotifications } from '../../context/NotificationContext'
import { formatRelativeTime } from '../../lib/format'

export function NotificationPanel({ onClose }: { onClose: () => void }) {
  const { notifications, markRead, markAllRead } = useNotifications()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose()
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  return (
    <div
      ref={ref}
      className="absolute right-0 top-12 z-50 w-80 rounded-lg border border-slate-200 bg-white shadow-lg"
      role="dialog"
      aria-label="Notifications"
    >
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-900">Notifications</h2>
        {notifications.some((n) => !n.read) && (
          <button
            type="button"
            onClick={() => markAllRead()}
            className="text-xs font-medium text-navy-700 hover:underline"
          >
            Mark all read
          </button>
        )}
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-slate-500">No notifications yet.</p>
        ) : (
          <ul>
            {notifications.map((notification) => (
              <li key={notification.id} className="border-b border-slate-100 last:border-0">
                <button
                  type="button"
                  onClick={() => markRead(notification.id)}
                  className={`block w-full px-4 py-3 text-left hover:bg-slate-50 ${
                    notification.read ? '' : 'bg-navy-900/5'
                  }`}
                >
                  <span className="flex items-start justify-between gap-2">
                    <span className="text-sm font-medium text-slate-900">{notification.title}</span>
                    {!notification.read && (
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-navy-700" aria-hidden="true" />
                    )}
                  </span>
                  <span className="mt-0.5 block text-sm text-slate-600">{notification.body}</span>
                  <span className="mt-1 block text-xs text-slate-400">
                    {formatRelativeTime(notification.createdAt)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
