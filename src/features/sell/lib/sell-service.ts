import apiService from '@/lib/apiService'
import { GIFT_METHOD_CODES } from '../data/data'
import { sellCreateSchema, type SellCreateInput } from '../data/schema'

export const sellService = {
  async create(body: SellCreateInput) {
    const parsed = sellCreateSchema.parse(body)
    // Sanitizar payload para backend: quitar campos null/irrelevantes y precioUnitario
    const {
      descuentoAdicional,
      montoGiftCard,
      detalle,
      codigoMetodoPagoSin,
      ...rest
    } = parsed as any
    const clean: any = {
      ...rest,
      codigoMetodoPagoSin,
      detalle: detalle.map((it: any) => {
        const item: any = {
          productoId: it.productoId,
          cantidad: it.cantidad,
        }
        if (it.montoDescuento != null && it.montoDescuento > 0) {
          item.montoDescuento = it.montoDescuento
        }
        return item
      }),
    }
    if (descuentoAdicional != null && descuentoAdicional > 0) {
      clean.descuentoAdicional = descuentoAdicional
    }
    if (
      montoGiftCard != null &&
      montoGiftCard > 0 &&
      GIFT_METHOD_CODES.has(codigoMetodoPagoSin)
    ) {
      clean.montoGiftCard = montoGiftCard
    }
    const res = await apiService.post<any>('/ventas', clean)
    if (!res.ok) throw new Error(res.message)
    const payload = res.data?.data || res.data || res
    return payload
  },
  async fetchBranches(empresaId: number | null) {
    if (!empresaId) return []
    const res = await apiService.get<any>(
      `/sucursales?empresa_id[eq]=${empresaId}`
    )
    if (!res.ok) throw new Error(res.message)
    return res.data?.data || res.data || []
  },
  async fetchPos() {
    const res = await apiService.get<any>('/puntos-venta')
    if (!res.ok) throw new Error(res.message)
    return res.data?.data || res.data || []
  },
  async fetchDocAct(empresaId: number | null) {
    if (!empresaId) return []
    const res = await apiService.get<any>(
      `/homologacion/documentos-actividades/${empresaId}`
    )
    if (!res.ok) throw new Error(res.message)
    return res.data?.data || res.data || []
  },
  async fetchPaymentMethods() {
    const res = await apiService.get<any>('/sincronizacion/metodos-pago')
    if (!res.ok) throw new Error(res.message)
    return res.data?.data || res.data || []
  },
  async fetchCurrencies() {
    const res = await apiService.get<any>('/sincronizacion/monedas')
    if (!res.ok) throw new Error(res.message)
    return res.data?.data || res.data || []
  },
  async fetchCustomerById(id: number) {
    const res = await apiService.get<any>(`/clientes/${id}`)
    if (!res.ok) throw new Error(res.message)
    return res.data?.data || res.data || res
  },
  async fetchProducts(empresaId: number | null) {
    if (!empresaId) return []
    const res = await apiService.get<any>(
      `/productos?empresa_id[eq]=${empresaId}&include=unidad_medida`
    )
    if (!res.ok) throw new Error(res.message)
    const payload = res.data?.data || res.data || []
    return Array.isArray(payload) ? payload : []
  },
}
