import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import type { AuthenticatedUser } from '../types'
import { authService } from '../services/authService'

interface AuthContextValue {
  user: AuthenticatedUser | null
  isInitializing: boolean
  signInWithDigitalId: () => Promise<void>
  signInAsDemoCitizen: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    setUser(authService.getCurrentUser())
    setIsInitializing(false)
  }, [])

  const signInWithDigitalId = useCallback(async () => {
    const signedIn = await authService.signInWithDigitalId()
    setUser(signedIn)
  }, [])

  const signInAsDemoCitizen = useCallback(async () => {
    const signedIn = await authService.signInAsDemoCitizen()
    setUser(signedIn)
  }, [])

  const signOut = useCallback(async () => {
    await authService.signOut()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, isInitializing, signInWithDigitalId, signInAsDemoCitizen, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider.')
  return ctx
}
