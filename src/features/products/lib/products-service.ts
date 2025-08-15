// lib/products-service.ts
import Cookies from 'js-cookie'
import apiService from '@/lib/apiService'
import { decodeToken } from '@/lib/jwtUtils'
import {
  Product,
  NewProduct,
  UpdateProduct,
  HomologacionData,
  UnidadesMedidaResponse,
} from '@/features/products/data/schema'

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

export const productsApi = {
  // LISTAR productos con filtro por empresa
  list: async () => {
    const empresaId = getEmpresaIdFromCookie()
    const base = '/productos?include=unidad_medida'
    const url = empresaId
      ? `${base}&empresa_id[eq]=${encodeURIComponent(String(empresaId))}`
      : base
    const res = await apiService.get<any>(url)
    if (!res.ok) throw new Error(res.message)

    const payload = res.data
    if (payload && payload.data && Array.isArray(payload.data)) {
      return payload.data as Product[]
    }
    return payload as Product[]
  },

  // OBTENER un producto por ID
  get: async (id: string | number) => {
    const res = await apiService.get<any>(
      `/productos/${id}?include=unidad_medida`
    )
    if (!res.ok) throw new Error(res.message)
    return unwrap<Product>(res.data)
  },

  // CREAR producto
  create: async (body: NewProduct) => {
    const res = await apiService.post<Product>('/productos', body)
    if (!res.ok) throw new Error(res.message)
    return res.data
  },

  // ACTUALIZAR producto
  update: async (id: string | number, body: UpdateProduct) => {
    const res = await apiService.put<Product>(`/productos/${id}`, body)
    if (!res.ok) throw new Error(res.message)
    return res.data
  },

  // ELIMINAR producto
  delete: async (id: string | number) => {
    const res = await apiService.del(`/productos/${id}`)
    if (!res.ok) throw new Error(res.message)
    return res.data
  },

  // OBTENER actividades y productos SIN para selects
  getHomologacion: async (empresaId: number) => {
    const res = await apiService.get<HomologacionData>(
      `/homologacion/actividades-productos/${empresaId}`
    )
    if (!res.ok) throw new Error(res.message)
    return res.data
  },

  // OBTENER unidades de medida para selects
  getUnidadesMedida: async () => {
    const res = await apiService.get<UnidadesMedidaResponse>(
      '/sincronizacion/unidad-medida'
    )
    if (!res.ok) throw new Error(res.message)
    return res.data
  },
}
