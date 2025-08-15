import { z } from 'zod'

export const sellItemSchema = z.object({
  productoId: z.number().min(1, 'Seleccione producto'),
  cantidad: z.number().min(1, 'Cantidad > 0'),
  montoDescuento: z.number().optional().nullable(),
  // precioUnitario siempre presente para evitar conflictos de tipos en react-hook-form
  precioUnitario: z.number().default(0),
})

export const sellCreateSchema = z.object({
  clienteId: z.number().min(1, 'Seleccione cliente'),
  sucursalId: z.number().min(1, 'Seleccione sucursal'),
  puntoVentaId: z.number().nullable(),
  codigoDocumentoSectorSin: z.number().min(1, 'Seleccione documento sector'),
  codigoActividadEconomicaSin: z
    .number()
    .min(1, 'Seleccione actividad económica'),
  codigoMetodoPagoSin: z.number().min(1, 'Seleccione método de pago'),
  codigoMonedaSin: z.number().min(1, 'Seleccione moneda'),
  tipoCambioSin: z.number().min(0, 'Ingrese tipo de cambio'),
  descuentoAdicional: z.number().optional().nullable(),
  montoGiftCard: z.number().optional().nullable(),
  detalle: z.array(sellItemSchema).min(1, 'Agregue al menos un ítem'),
})

export type SellItem = z.infer<typeof sellItemSchema>
export type SellCreateInput = z.infer<typeof sellCreateSchema>
