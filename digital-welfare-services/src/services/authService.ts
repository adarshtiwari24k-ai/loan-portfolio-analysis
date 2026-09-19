import type { AuthenticatedUser } from '../types'
import { networkDelay, readValue, removeValue, writeValue } from './storage'

const SESSION_KEY = 'session'

const DEMO_USER: AuthenticatedUser = {
  name: 'Alex Morgan',
  email: 'alex.morgan@example.demo',
  ppsNumber: '1234567T',
  method: 'demo',
  verified: true,
}

export const authService = {
  async signInWithDigitalId(): Promise<AuthenticatedUser> {
    await networkDelay(600)
    const user: AuthenticatedUser = { ...DEMO_USER, method: 'digital-id' }
    writeValue(SESSION_KEY, user)
    return user
  },

  async signInAsDemoCitizen(): Promise<AuthenticatedUser> {
    await networkDelay(400)
    const user: AuthenticatedUser = { ...DEMO_USER, method: 'demo' }
    writeValue(SESSION_KEY, user)
    return user
  },

  async signOut(): Promise<void> {
    await networkDelay(150)
    removeValue(SESSION_KEY)
  },

  getCurrentUser(): AuthenticatedUser | null {
    return readValue<AuthenticatedUser>(SESSION_KEY)
  },
}
