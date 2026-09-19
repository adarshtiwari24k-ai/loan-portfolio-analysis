export function generateId(prefix: string): string {
  const random = Math.random().toString(36).slice(2, 10)
  return `${prefix}_${Date.now().toString(36)}${random}`
}

export function generateApplicationNumber(): string {
  const year = new Date().getFullYear()
  const sequence = Math.floor(100000 + Math.random() * 899999)
  return `DWS-${year}-${sequence}`
}
