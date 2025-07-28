import apiService from '@/lib/apiService'
import {
  Company,
  NewCompany,
  CompaniesResponse,
} from '@/features/company/data/schema'

export const companiesApi = {
  // Obtener todas las empresas
  list: async () => {
    const res = await apiService.get<CompaniesResponse>('/empresas')
    if (!res.ok) throw new Error(res.message)
    return res.data.data.reverse() // Devolver solo el array de empresas
  },

  // Crear una nueva empresa
  create: async (body: NewCompany) => {
    const res = await apiService.post<Company>('/empresas', body)
    if (!res.ok) throw new Error(res.message)
    return res.data
  },

  // Obtener una empresa por ID
  getById: async (id: string | number) => {
    const res = await apiService.get<Company>(`/empresas/${id}`)
    if (!res.ok) throw new Error(res.message)
    return res.data
  },

  // Actualizar una empresa
  update: async (id: string | number, body: Partial<NewCompany>) => {
    console.log('Updating company with ID:', id)
    const res = await apiService.put<Company>(`/empresas/${id}`, body)
    if (!res.ok) throw new Error(res.message)
    return res.data
  },

  // Eliminar una empresa
  delete: async (id: string | number) => {
    const res = await apiService.del(`/empresas/${id}`)
    if (!res.ok) throw new Error(res.message)
    return res.data
  },
}
