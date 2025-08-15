import { z } from 'zod'

export const saleItemSchema = z.object({
  productoId: z.number(),
  cantidad: z.number().min(1),
  montoDescuento: z.number().optional().nullable(),
})

export const saleSchema = z.object({
  id: z.number(),
  clienteId: z.number(),
  sucursalId: z.number(),
  puntoVentaId: z.number().nullable(),
  codigoDocumentoSectorSin: z.number(),
  codigoActividadEconomicaSin: z.number(),
  codigoMetodoPagoSin: z.number(),
  codigoMonedaSin: z.number(),
  tipoCambioSin: z.number(),
  descuentoAdicional: z.number().optional().nullable(),
  montoGiftCard: z.number().optional().nullable(),
  detalle: z.array(saleItemSchema),
  montoTotal: z.string(),
  montoTotalMoneda: z.string(),
  activo: z.boolean(),
  fechaEmision: z.string(),
  createdBy: z.number().nullable().optional(),
  updatedBy: z.number().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const saleListResponseSchema = z.object({
  data: z.array(saleSchema),
})

export type Sale = z.infer<typeof saleSchema>
export type SaleItem = z.infer<typeof saleItemSchema>
