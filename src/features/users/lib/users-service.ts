// lib/users-service.ts
import Cookies from 'js-cookie'
import apiService from '@/lib/apiService'
import { decodeToken } from '@/lib/jwtUtils'
import { User, NewUser, UpdateUser } from '@/features/users/data/schema'

// Helper para extraer data cuando la API envía { data: {...}, status: 'success' }
function unwrap<T>(res: any): T {
  if (res && typeof res === 'object') {
    if ('data' in res && res.data && !Array.isArray(res.data)) {
      // Caso de wrapper single
      if ('status' in res && res.status === 'success') return res.data as T
    }
    // Caso directo
    return res as T
  }
  return res as T
}

function getEmpresaIdFromCookie(): number | null {
  try {
    const cookieToken = Cookies.get('thisisjustarandomstring')
    if (!cookieToken) return null
    const token = JSON.parse(cookieToken)
    const decoded = decodeToken(token)
    return decoded?.empresaId ?? null
  } catch {
    return null
  }
}

export const usersApi = {
  list: async () => {
    const empresaId = getEmpresaIdFromCookie()
    const base = '/usuarios?include=rol&include=empresa'
    const url = empresaId
      ? `${base}&empresa_id[eq]=${encodeURIComponent(String(empresaId))}`
      : base
    const res = await apiService.get<any>(url)
    if (!res.ok) throw new Error(res.message)
    // La API puede devolver { data: [...], status } ó directamente [...]
    const payload = res.data
    if (payload && payload.data && Array.isArray(payload.data)) {
      return payload.data as User[]
    }
    return payload as User[]
  },

  // LISTAR Solo la informacion de un usuario
  get: async (id: string | number) => {
    const res = await apiService.get<any>(
      `/usuarios/${id}?include=rol&include=empresa`
    )
    if (!res.ok) throw new Error(res.message)
    return unwrap<User>(res.data)
  },

  create: async (body: NewUser) => {
    const res = await apiService.post<User>('/usuarios', body)
    if (!res.ok) throw new Error(res.message)
    return res.data
  },

  update: async (
    id: string | number,
    body: Partial<UpdateUser> & { password_confirmation?: string }
  ) => {
    const res = await apiService.patch<User>(`/usuarios/${id}`, body)
    if (!res.ok) throw new Error(res.message)
    return res.data
  },
}
