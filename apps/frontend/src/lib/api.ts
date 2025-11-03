import axios, { AxiosInstance } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

let apiClient: AxiosInstance

// Initialize API client
export function initializeAPI(token?: string) {
  apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Add token if available
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  // Add tenant domain header for multi-tenancy
  const host = window.location.host
  if (!host.includes('api.')) {
    apiClient.defaults.headers.common['X-Tenant-Domain'] = host
  }

  return apiClient
}

export function getAPI() {
  if (!apiClient) {
    initializeAPI()
  }
  return apiClient
}

// Auth API
export const authAPI = {
  register: async (email: string, password: string, departmentName: string, departmentSlug: string) => {
    const { data } = await getAPI().post('/auth/register', {
      email,
      password,
      department_name: departmentName,
      department_slug: departmentSlug,
    })
    return data
  },

  login: async (email: string, password: string) => {
    const { data } = await getAPI().post('/auth/login', {
      email,
      password,
    })
    return data
  },
}

// Boot API
export const bootAPI = {
  get: async () => {
    const { data } = await getAPI().get('/boot')
    return data
  },
}

// Pages API
export const pagesAPI = {
  list: async () => {
    const { data } = await getAPI().get('/pages')
    return data
  },

  create: async (slug: string, title: string, meta?: Record<string, any>) => {
    const { data } = await getAPI().post('/pages', {
      slug,
      title,
      meta: meta || {},
      published: false,
    })
    return data
  },

  update: async (id: string, updates: any) => {
    const { data } = await getAPI().put(`/pages/${id}`, updates)
    return data
  },

  delete: async (id: string) => {
    await getAPI().delete(`/pages/${id}`)
  },
}

// Blocks API
export const blocksAPI = {
  create: async (pageId: string, kind: string, order: number, config: Record<string, any>) => {
    const { data } = await getAPI().post('/blocks', {
      page_id: pageId,
      kind,
      order,
      config,
    })
    return data
  },

  update: async (id: string, updates: any) => {
    const { data } = await getAPI().put(`/blocks/${id}`, updates)
    return data
  },

  delete: async (id: string) => {
    await getAPI().delete(`/blocks/${id}`)
  },
}

// Media API
export const mediaAPI = {
  presign: async (filename: string, mimeType: string) => {
    const { data } = await getAPI().post('/media/presign', {
      filename,
      mime_type: mimeType,
    })
    return data
  },

  get: async (id: string) => {
    const { data } = await getAPI().get(`/media/${id}`)
    return data
  },
}

// Programs API
export const programsAPI = {
  list: async () => {
    const { data } = await getAPI().get('/programs')
    return data
  },

  create: async (program: any) => {
    const { data } = await getAPI().post('/programs', program)
    return data
  },

  update: async (id: string, updates: any) => {
    const { data } = await getAPI().put(`/programs/${id}`, updates)
    return data
  },

  delete: async (id: string) => {
    await getAPI().delete(`/programs/${id}`)
  },
}

// Events API
export const eventsAPI = {
  list: async () => {
    const { data } = await getAPI().get('/events')
    return data
  },

  create: async (event: any) => {
    const { data } = await getAPI().post('/events', event)
    return data
  },

  update: async (id: string, updates: any) => {
    const { data } = await getAPI().put(`/events/${id}`, updates)
    return data
  },

  delete: async (id: string) => {
    await getAPI().delete(`/events/${id}`)
  },
}

// Facilities API
export const facilitiesAPI = {
  list: async () => {
    const { data } = await getAPI().get('/facilities')
    return data
  },

  create: async (facility: any) => {
    const { data } = await getAPI().post('/facilities', facility)
    return data
  },

  update: async (id: string, updates: any) => {
    const { data } = await getAPI().put(`/facilities/${id}`, updates)
    return data
  },

  delete: async (id: string) => {
    await getAPI().delete(`/facilities/${id}`)
  },
}

// Facility Slots API
export const slotsAPI = {
  list: async (facilityId?: string) => {
    const params = facilityId ? { facility_id: facilityId } : {}
    const { data } = await getAPI().get('/facility-slots', { params })
    return data
  },

  create: async (facilityId: string, startsAt: Date, endsAt: Date) => {
    const { data } = await getAPI().post('/facility-slots', {
      facility_id: facilityId,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
    })
    return data
  },

  update: async (id: string, updates: any) => {
    const { data } = await getAPI().put(`/facility-slots/${id}`, updates)
    return data
  },

  delete: async (id: string) => {
    await getAPI().delete(`/facility-slots/${id}`)
  },
}

// Bookings API
export const bookingsAPI = {
  list: async () => {
    const { data } = await getAPI().get('/bookings')
    return data
  },

  update: async (id: string, status: string) => {
    const { data } = await getAPI().put(`/bookings/${id}`, { status })
    return data
  },

  createPublic: async (resourceId: string, requesterName: string, requesterEmail: string, notes?: string) => {
    const { data } = await getAPI().post('/public/bookings', {
      resource_type: 'facility_slot',
      resource_id: resourceId,
      requester_name: requesterName,
      requester_email: requesterEmail,
      notes,
    })
    return data
  },
}

// Public API
export const publicAPI = {
  getPage: async (slug: string) => {
    const { data } = await getAPI().get(`/public/pages/${slug}`)
    return data
  },

  getPrograms: async () => {
    const { data } = await getAPI().get('/public/programs')
    return data
  },

  getUpcomingEvents: async () => {
    const { data } = await getAPI().get('/public/events/upcoming')
    return data
  },

  getFacilities: async () => {
    const { data } = await getAPI().get('/public/facilities')
    return data
  },

  getSitemap: async () => {
    const { data } = await getAPI().get('/public/sitemap.xml')
    return data
  },
}
