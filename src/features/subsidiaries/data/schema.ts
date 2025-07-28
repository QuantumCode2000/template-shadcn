import { z } from 'zod'

// Schema para una sucursal
export const subsidiarySchema = z.object({
  id: z.number(),
  empresaId: z.number(),
  codigo: z.number(),
  nombre: z.string(),
  municipio: z.string(),
  direccion: z.string(),
  telefono: z.number(),
  descripcion: z.string().nullable(),
  codigoSin: z.number(),
  activo: z.boolean(),
  createdBy: z.number(),
  updatedBy: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

// Schema para crear una nueva sucursal
export const newSubsidiarySchema = z.object({
  empresaId: z.number().min(1, 'La empresa es obligatoria'),
  codigo: z.number().min(1, 'El código es obligatorio'),
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  municipio: z.string().min(1, 'El municipio es obligatorio'),
  direccion: z.string().min(1, 'La dirección es obligatoria'),
  telefono: z.number().min(1, 'El teléfono es obligatorio'),
  codigoSin: z.number().min(0, 'El código SIN es obligatorio'),
})

// Schema para actualizar una sucursal
export const updateSubsidiarySchema = z.object({
  empresaId: z.number().min(1, 'La empresa es obligatoria'),
  codigo: z.number().min(1, 'El código es obligatorio'),
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  municipio: z.string().min(1, 'El municipio es obligatorio'),
  direccion: z.string().min(1, 'La dirección es obligatoria'),
  telefono: z.number().min(1, 'El teléfono es obligatorio'),
  codigoSin: z.number().min(0, 'El código SIN es obligatorio'),
})

// Schema para la respuesta de la API
export const subsidiariesResponseSchema = z.object({
  data: z.array(subsidiarySchema),
  status: z.literal('success'),
})

// Tipos inferidos
export type Subsidiary = z.infer<typeof subsidiarySchema>
export type NewSubsidiary = z.infer<typeof newSubsidiarySchema>
export type UpdateSubsidiary = z.infer<typeof updateSubsidiarySchema>
export type SubsidiariesResponse = z.infer<typeof subsidiariesResponseSchema>

// Schema de lista para validación
export const subsidiaryListSchema = z.array(subsidiarySchema)
