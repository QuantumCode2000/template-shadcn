import { z } from 'zod'

/* =========================
   Sub-esquemas de respuesta
   ========================= */

// Unidad de medida que viene del include
const UnidadMedidaSchema = z.object({
  codigoSin: z.number(),
  descripcionSin: z.string(),
  createdBy: z.number(),
  updatedBy: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

// Actividad SIN para los selects
export const ActividadSinSchema = z.object({
  codigo_sin: z.number(),
  descripcion_sin: z.string(),
  tipo_actividad_sin: z.string(),
})

// Producto SIN para los selects
export const ProductoSinSchema = z.object({
  codigo_sin: z.number(),
  codigo_actividad_sin: z.number(),
  descripcion_sin: z.string(),
})

// Respuesta del endpoint de homologación
export const HomologacionSchema = z.object({
  data: z.object({
    actividades: z.array(ActividadSinSchema),
    productos: z.array(ProductoSinSchema),
  }),
  status: z.literal('success'),
})

// Unidad de medida del endpoint de sincronización
export const UnidadMedidaSinSchema = z.object({
  codigoSin: z.number(),
  descripcionSin: z.string(),
  createdBy: z.number(),
  updatedBy: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const UnidadesMedidaResponseSchema = z.object({
  data: z.array(UnidadMedidaSinSchema),
  status: z.literal('success'),
})

/* =========================
   DTO de LECTURA (lo que devuelve la API)
   ========================= */
export const productSchema = z.object({
  id: z.number(),
  empresaId: z.number(),
  codigo: z.string(),
  codigoProductoSin: z.number(),
  codigoActividadSin: z.number(),
  descripcion: z.string(),
  codigoUnidadMedida: z.number(),
  precioUnitario: z.string(), // Viene como string de la API
  createdBy: z.number(),
  updatedBy: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  unidadMedida: UnidadMedidaSchema.optional(), // Solo cuando include=unidad_medida
})

export const productsListSchema = z.object({
  data: z.array(productSchema),
  status: z.literal('success'),
})

/* =========================
   DTOs de ESCRITURA
   ========================= */
export const newProductSchema = z.object({
  empresaId: z.number(),
  codigo: z.string().min(1, 'El código es obligatorio'),
  codigoProductoSin: z.number(),
  codigoActividadSin: z.number(),
  descripcion: z.string().min(1, 'La descripción es obligatoria'),
  codigoUnidadMedida: z.number(),
  precioUnitario: z.number().min(0.01, 'El precio debe ser mayor a 0'),
})

export const updateProductSchema = z.object({
  empresaId: z.number().optional(),
  codigo: z.string().min(1, 'El código es obligatorio').optional(),
  codigoProductoSin: z.number().optional(),
  codigoActividadSin: z.number().optional(),
  descripcion: z.string().min(1, 'La descripción es obligatoria').optional(),
  codigoUnidadMedida: z.number().optional(),
  precioUnitario: z
    .number()
    .min(0.01, 'El precio debe ser mayor a 0')
    .optional(),
})

/* =========================
   Tipos TypeScript
   ========================= */
export type Product = z.infer<typeof productSchema>
export type ProductsList = z.infer<typeof productsListSchema>
export type NewProduct = z.infer<typeof newProductSchema>
export type UpdateProduct = z.infer<typeof updateProductSchema>
export type ActividadSin = z.infer<typeof ActividadSinSchema>
export type ProductoSin = z.infer<typeof ProductoSinSchema>
export type UnidadMedidaSin = z.infer<typeof UnidadMedidaSinSchema>
export type HomologacionData = z.infer<typeof HomologacionSchema>
export type UnidadesMedidaResponse = z.infer<
  typeof UnidadesMedidaResponseSchema
>
