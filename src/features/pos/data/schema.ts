import { z } from 'zod'

export const posSchema = z.object({
  id: z.number(),
  codigoSin: z.number(),
  nombre: z.string(),
  descripcion: z.string().nullable().optional(),
  tipo: z.number(),
  sucursalId: z.number(),
  activo: z.boolean(),
  createdBy: z.number().nullable().optional(),
  updatedBy: z.number().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const posListResponseSchema = z.object({
  data: z.array(posSchema),
  status: z.literal('success').optional(),
})

export type Pos = z.infer<typeof posSchema>
export type PosListResponse = z.infer<typeof posListResponseSchema>
