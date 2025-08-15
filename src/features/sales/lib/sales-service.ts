import apiService from '@/lib/apiService'
import { saleSchema, type Sale } from '../data/schema'

function unwrapArray(res: any): any[] {
  if (res?.data?.data && Array.isArray(res.data.data)) return res.data.data
  if (res?.data && Array.isArray(res.data)) return res.data
  if (Array.isArray(res)) return res
  return []
}

export const salesApi = {
  async list(): Promise<Sale[]> {
    const res = await apiService.get<any>('/ventas')
    if (!res.ok) throw new Error(res.message)
    return unwrapArray(res).map((v) => saleSchema.parse(v)) as Sale[]
  },
  async get(id: number | string): Promise<Sale> {
    const res = await apiService.get<any>(`/ventas/${id}`)
    if (!res.ok) throw new Error(res.message)
    const payload = res.data?.data || res.data || res
    return saleSchema.parse(payload)
  },
  async create(body: any): Promise<Sale> {
    const res = await apiService.post<any>('/ventas', body)
    if (!res.ok) throw new Error(res.message)
    const payload = res.data?.data || res.data || res
    return saleSchema.parse(payload)
  },
}
