import apiService from '@/lib/apiService'
import {
  customerSchema,
  docTypeSchema,
  type Customer,
  type DocType,
  customerCreateSchema,
} from '../data/schema'

function extractArray<T>(res: any): T[] {
  if (res?.data?.data && Array.isArray(res.data.data)) return res.data.data
  if (res?.data && Array.isArray(res.data)) return res.data
  if (Array.isArray(res)) return res
  return []
}

export const customersApi = {
  async typeahead(query: string) {
    const res = await apiService.get<any>(
      `/clientes?numero_documento_identidad[lk]=${encodeURIComponent(query)}`
    )
    if (!res.ok) throw new Error(res.message)
    return extractArray<any>(res).map((c) =>
      customerSchema.parse({
        ...c,
        numeroDocumentoIdentidad: String(
          c.numeroDocumentoIdentidad ?? c.numero_documento_identidad ?? ''
        ),
      })
    ) as Customer[]
  },
  async get(id: number | string) {
    const res = await apiService.get<any>(`/clientes/${id}`)
    if (!res.ok) throw new Error(res.message)
    const payload = res.data?.data || res.data || res
    return customerSchema.parse({
      ...payload,
      numeroDocumentoIdentidad: String(
        payload.numeroDocumentoIdentidad ??
          payload.numero_documento_identidad ??
          ''
      ),
    })
  },
  async create(body: any) {
    const parsed = customerCreateSchema.parse(body)
    const res = await apiService.post<any>('/clientes', parsed)
    if (!res.ok) throw new Error(res.message)
    const payload = res.data?.data || res.data || res
    return customerSchema.parse(payload)
  },
  async getDocTypes() {
    const res = await apiService.get<any>('/sincronizacion/documento-identidad')
    if (!res.ok) throw new Error(res.message)
    return extractArray<any>(res).map((d) =>
      docTypeSchema.parse(d)
    ) as DocType[]
  },
}
