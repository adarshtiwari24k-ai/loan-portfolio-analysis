// Thin persistence layer over localStorage. Every read/write is wrapped so a
// real backend (REST/GraphQL over the government API/integration layer) could
// replace this module later without touching callers - see applicationService,
// authService, notificationService and caseService, which are the only
// modules that import this file directly.

const NAMESPACE = 'dws'

function key(name: string): string {
  return `${NAMESPACE}:${name}`
}

export function readList<T>(name: string): T[] {
  try {
    const raw = window.localStorage.getItem(key(name))
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as T[]) : []
  } catch {
    return []
  }
}

export function writeList<T>(name: string, items: T[]): void {
  try {
    window.localStorage.setItem(key(name), JSON.stringify(items))
  } catch {
    // localStorage may be unavailable (private browsing, quota exceeded).
    // The demo degrades gracefully by keeping state in memory only.
  }
}

export function readValue<T>(name: string): T | null {
  try {
    const raw = window.localStorage.getItem(key(name))
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function writeValue<T>(name: string, value: T): void {
  try {
    window.localStorage.setItem(key(name), JSON.stringify(value))
  } catch {
    // ignore
  }
}

export function removeValue(name: string): void {
  try {
    window.localStorage.removeItem(key(name))
  } catch {
    // ignore
  }
}

// Simulates network latency so the UI exercises real loading states.
export function networkDelay(ms = 350): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
