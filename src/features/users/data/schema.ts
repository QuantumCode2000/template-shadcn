import { z } from 'zod'
import { fa } from '@faker-js/faker'

/* =========================
   Sub-esquemas de respuesta
   ========================= */
const RolSchema = z.object({
  id: z.number(),
  codigo: z.string(),
})

const EmpresaSchema = z.object({
  codigo: z.number(),
  nombre: z.string(),
  descripcion: z.string().nullable().optional(),
  nit: z.number().nullable().optional(),
  tokenDelegado: z.string().nullable().optional(),
  codigoAmbienteSin: z.number().nullable().optional(),
  codigoModalidadSin: z.number().nullable().optional(),
  activo: z.boolean().nullable().optional(),
  id: z.number(),
  logo: z.string().nullable().optional(),
})

/* =========================
   DTO de LECTURA (lo que devuelve la API)
   ========================= */
export const userSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  apellido: z.string(),
  usuario: z.string(),
  email: z.string().email(),
  empresaId: z.number().nullable(),
  activo: z.boolean(),
  rol: RolSchema.nullable(),
  empresa: EmpresaSchema.nullable(),
})

export const usersListSchema = z.object({
  data: z.array(userSchema),
  status: z.literal('success'),
})

export const newUserSchema = z.object({
  nombre: z.string(),
  apellido: z.string(),
  usuario: z.string(),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  empresaId: z.number().optional(),
  rolId: z.number(),
})

export const updateUserSchema = newUserSchema.partial().extend({
  id: z.number(),
  activo: z.boolean().optional(),
})

export type User = z.infer<typeof userSchema>
export type UsersList = z.infer<typeof usersListSchema>
export type NewUser = z.infer<typeof newUserSchema>
export type UpdateUser = z.infer<typeof updateUserSchema>
