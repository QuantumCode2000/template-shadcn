import apiService from '@/lib/apiService'
import {
  Subsidiary,
  NewSubsidiary,
  SubsidiariesResponse,
} from '@/features/subsidiaries/data/schema'

export const subsidiariesApi = {
  // Obtener todas las sucursales
  list: async () => {
    const res = await apiService.get<SubsidiariesResponse>('/sucursales')
    if (!res.ok) throw new Error(res.message)
    return res.data.data.reverse()
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
    console.log('Updating subsidiary with ID:', id)
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
