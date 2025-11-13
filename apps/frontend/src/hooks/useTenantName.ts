import { useState, useEffect } from 'react'
import { getAPI } from '../lib/api'

export function useTenantName() {
  const [tenantName, setTenantName] = useState<string>('Recreation Department')

  useEffect(() => {
    const fetchTenantName = async () => {
      try {
        const api = getAPI()
        const response = await api.get('/website/preview-config')

        if (response.data.tenantName) {
          setTenantName(response.data.tenantName)
        }
      } catch (error) {
        console.error('Failed to fetch tenant name:', error)
      }
    }

    fetchTenantName()
  }, [])

  return tenantName
}
