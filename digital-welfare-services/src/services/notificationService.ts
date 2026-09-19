import type { AppNotification } from '../types'
import { generateId } from '../lib/ids'
import { networkDelay, readList, writeList } from './storage'

const NOTIFICATIONS_KEY = 'notifications'

export const notificationService = {
  async list(userEmail: string): Promise<AppNotification[]> {
    await networkDelay(200)
    return readList<AppNotification>(NOTIFICATIONS_KEY)
      .filter((n) => n.userEmail === userEmail)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  },

  async create(input: {
    userEmail: string
    title: string
    body: string
    applicationId?: string
  }): Promise<AppNotification> {
    const notification: AppNotification = {
      id: generateId('notif'),
      userEmail: input.userEmail,
      title: input.title,
      body: input.body,
      applicationId: input.applicationId,
      createdAt: new Date().toISOString(),
      read: false,
    }
    const all = readList<AppNotification>(NOTIFICATIONS_KEY)
    all.push(notification)
    writeList(NOTIFICATIONS_KEY, all)
    return notification
  },

  async markRead(notificationId: string): Promise<void> {
    await networkDelay(120)
    const all = readList<AppNotification>(NOTIFICATIONS_KEY)
    const next = all.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    writeList(NOTIFICATIONS_KEY, next)
  },

  async markAllRead(userEmail: string): Promise<void> {
    await networkDelay(150)
    const all = readList<AppNotification>(NOTIFICATIONS_KEY)
    const next = all.map((n) => (n.userEmail === userEmail ? { ...n, read: true } : n))
    writeList(NOTIFICATIONS_KEY, next)
  },
}
