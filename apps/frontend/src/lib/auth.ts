import { initializeAPI } from './api'

interface AuthToken {
  token: string
  userId: string
  tenantId: string
  email: string
}

const STORAGE_KEY = 'rec-hub-auth'

export function saveAuthToken(auth: AuthToken) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
  initializeAPI(auth.token)
}

export function getAuthToken(): AuthToken | null {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return null
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

export function clearAuthToken() {
  localStorage.removeItem(STORAGE_KEY)
}

export function isAuthenticated(): boolean {
  return getAuthToken() !== null
}

export function getToken(): string | null {
  return getAuthToken()?.token || null
}

export function getUserId(): string | null {
  return getAuthToken()?.userId || null
}

export function getTenantId(): string | null {
  return getAuthToken()?.tenantId || null
}

export function getEmail(): string | null {
  return getAuthToken()?.email || null
}
