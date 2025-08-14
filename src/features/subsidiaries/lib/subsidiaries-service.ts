import Cookies from 'js-cookie'
import apiService from '@/lib/apiService'
import { decodeToken } from '@/lib/jwtUtils'
import {
  Subsidiary,
  NewSubsidiary,
  SubsidiariesResponse,
} from '@/features/subsidiaries/data/schema'

function getEmpresaIdFromToken(): number | null {
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

export const subsidiariesApi = {
  // Obtener todas las sucursales
  list: async () => {
    const empresaId = getEmpresaIdFromToken()
    const base = '/sucursales'
    const url = empresaId
      ? `${base}?empresa_id[eq]=${encodeURIComponent(String(empresaId))}`
      : base
    const res = await apiService.get<SubsidiariesResponse>(url)
    if (!res.ok) throw new Error(res.message)
    return res.data
  },

  // Crear una nueva sucursal
  create: async (body: NewSubsidiary) => {
    const res = await apiService.post<Subsidiary>('/sucursales', body)
    if (!res.ok) throw new Error(res.message)
    return res.data
  },

  // Obtener una sucursal por ID
  getById: async (id: string | number) => {
    const res = await apiService.get<Subsidiary>(`/sucursales/${id}`)
    if (!res.ok) throw new Error(res.message)
    return res.data
  },

  // Actualizar una sucursal
  update: async (id: string | number, body: Partial<NewSubsidiary>) => {
    const res = await apiService.put<Subsidiary>(`/sucursales/${id}`, body)
    if (!res.ok) throw new Error(res.message)
    return res.data
  },

  // Eliminar una sucursal
  delete: async (id: string | number) => {
    const res = await apiService.del(`/sucursales/${id}`)
    if (!res.ok) throw new Error(res.message)
    return res.data
  },
}
