import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import type { AppNotification } from '../types'
import { notificationService } from '../services/notificationService'
import { useAuth } from './AuthContext'

interface NotificationContextValue {
  notifications: AppNotification[]
  unreadCount: number
  refresh: () => Promise<void>
  markRead: (id: string) => Promise<void>
  markAllRead: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<AppNotification[]>([])

  const refresh = useCallback(async () => {
    if (!user) {
      setNotifications([])
      return
    }
    const list = await notificationService.list(user.email)
    setNotifications(list)
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  const markRead = useCallback(
    async (id: string) => {
      await notificationService.markRead(id)
      await refresh()
    },
    [refresh],
  )

  const markAllRead = useCallback(async () => {
    if (!user) return
    await notificationService.markAllRead(user.email)
    await refresh()
  }, [user, refresh])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, refresh, markRead, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used within a NotificationProvider.')
  return ctx
}
