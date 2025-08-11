import { z } from 'zod'

export const userStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
])

const userSchema = z.object({
  id: z.string(),
  nombre: z.string().nullable(),
  apellido: z.string().nullable(),
  usuario: z.string().nullable(),
  email: z.string().email().nullable(),
  activo: z.boolean().nullable(),
  empresaId: z.number().nullable(),
  createdBy: z.string().nullable(),
  updatedBy: z.string().nullable(),
})

const newUserSchema = userSchema.omit({
  id: true,
  activo: true,
})

const updateUserSchema = newUserSchema.partial()

export type User = z.infer<typeof userSchema>
export type NewUser = z.infer<typeof newUserSchema>
export type UpdateUser = z.infer<typeof updateUserSchema>

export const userListSchema = z.array(userSchema)
