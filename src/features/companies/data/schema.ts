import { z } from 'zod'

// Schema para una empresa
export const companySchema = z.object({
  id: z.number(),
  codigo: z.number(),
  nombre: z.string(),
  descripcion: z.string(),
  nit: z.number(),
  codigoSistemaSin: z.string(),
  codigoAmbienteSin: z.number(),
  codigoModalidadSin: z.number(),
  activo: z.boolean(),
  tokenDelegado: z.string(),
  createdBy: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  updatedBy: z.number(),
})

// Schema para crear una nueva empresa
export const newCompanySchema = z.object({
  codigo: z.string().min(1, 'El código es obligatorio'),
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  descripcion: z.string().min(1, 'La descripción es obligatoria'),
  nit: z.number().min(1, 'El NIT es obligatorio'),
  codigoSistemaSin: z
    .string()
    .min(1, 'El código del sistema SIN es obligatorio'),
  codigoAmbienteSin: z
    .number()
    .min(1, 'El código de ambiente SIN es obligatorio'),
  codigoModalidadSin: z
    .number()
    .min(1, 'El código de modalidad SIN es obligatorio'),
  tokenDelegado: z.string().min(1, 'El token delegado es obligatorio'),
})

// Schema para actualizar una empresa
export const updateCompanySchema = z.object({
  codigo: z.string().min(1, 'El código es obligatorio'),
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  descripcion: z.string().min(1, 'La descripción es obligatoria'),
  nit: z.number().min(1, 'El NIT es obligatorio'),
  codigoSistemaSin: z
    .string()
    .min(1, 'El código del sistema SIN es obligatorio'),
  codigoAmbienteSin: z
    .number()
    .min(1, 'El código de ambiente SIN es obligatorio'),
  codigoModalidadSin: z
    .number()
    .min(1, 'El código de modalidad SIN es obligatorio'),
  tokenDelegado: z.string().min(1, 'El token delegado es obligatorio'),
})

// Schema para la respuesta de la API
export const companiesResponseSchema = z.object({
  data: z.array(companySchema),
  status: z.literal('success'),
})

// Tipos inferidos
export type Company = z.infer<typeof companySchema>
export type NewCompany = z.infer<typeof newCompanySchema>
export type UpdateCompany = z.infer<typeof updateCompanySchema>
export type CompaniesResponse = z.infer<typeof companiesResponseSchema>

// Schema de lista para validación
export const companyListSchema = z.array(companySchema)
