import { z } from 'zod'

export const docTypeSchema = z.object({
  codigoSin: z.number(),
  descripcionSin: z.string(),
})

export const customerSchema = z.object({
  id: z.number(),
  codigoDocumentoIdentidadSin: z.number(),
  numeroDocumentoIdentidad: z.string(),
  complemento: z.string().nullable().optional(),
  razonSocial: z.string(),
  celular: z.union([z.string(), z.number()]).nullable().optional(),
  email: z.string().email().nullable().optional(),
  createdBy: z.number().nullable().optional(),
  updatedBy: z.number().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const customerCreateSchema = z.object({
  codigoDocumentoIdentidadSin: z.number().min(1),
  numeroDocumentoIdentidad: z.string().min(3),
  complemento: z.string().optional().nullable(),
  razonSocial: z.string().min(1),
  celular: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
})

export type DocType = z.infer<typeof docTypeSchema>
export type Customer = z.infer<typeof customerSchema>
export type CustomerCreateInput = z.infer<typeof customerCreateSchema>
