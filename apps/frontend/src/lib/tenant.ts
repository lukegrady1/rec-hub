/**
 * Tenant utilities for multi-tenancy support
 */

export function getCurrentTenant(): string {
  const host = window.location.host
  // Extract subdomain: e.g., "demo.local.rechub" -> "demo"
  const parts = host.split('.')
  if (parts.length > 2) {
    return parts[0]
  }
  return 'localhost'
}

export function getTenantDomain(): string {
  return window.location.host
}

export function getTenantSlug(): string {
  const host = window.location.host
  const parts = host.split('.')
  if (parts.length > 2 && parts[0] !== 'api') {
    return parts[0]
  }
  return ''
}

export function isAdminPanel(): boolean {
  return window.location.pathname.startsWith('/admin')
}

export function isPublicSite(): boolean {
  return !isAdminPanel()
}
