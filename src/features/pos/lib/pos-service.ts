import apiService from '@/lib/apiService'
import { posListResponseSchema, posSchema, type Pos } from '../data/schema'

function unwrapList(res: any): Pos[] {
  if (res?.data?.data && Array.isArray(res.data.data)) return res.data.data
  if (res?.data && Array.isArray(res.data)) return res.data
  if (Array.isArray(res)) return res
  return []
}

export const posApi = {
  async list(): Promise<Pos[]> {
    const res = await apiService.get<any>('/puntos-venta')
    if (!res.ok) throw new Error(res.message)
    const items = unwrapList(res)
    return posListResponseSchema.shape.data.parse(items) as Pos[]
  },
  async get(id: number | string): Promise<Pos> {
    const res = await apiService.get<any>(`/puntos-venta/${id}`)
    if (!res.ok) throw new Error(res.message)
    const payload = res.data?.data || res.data || res
    return posSchema.parse(payload)
  },
  async remove(id: number | string) {
    const res = await apiService.del<any>(`/puntos-venta/${id}`)
    if (!res.ok) throw new Error(res.message)
    return true
  },
}
