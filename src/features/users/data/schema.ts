import { z } from 'zod'

const userSexSchema = z.union([z.literal('Masculino'), z.literal('Femenino')])

export const userStatusSchema = z.union([z.literal('active'), z.literal('inactive')])

const userSchema = z.object({
  id: z.string(),
  nombre: z.string().nullable(),
  apellido: z.string().nullable(),
  usuario : z.string().nullable(),
  email: z.string().email().nullable(),
  activo : z.boolean().nullable(),
})

// --- El resto de tus esquemas derivados ya no necesitan cambios ---

const newUserSchema = userSchema.omit({
  id: true,
  activo: true,
})

const updateUserSchema = newUserSchema.partial() // .partial() ya es suficiente

export type User = z.infer<typeof userSchema>
export type NewUser = z.infer<typeof newUserSchema>
export type UpdateUser = z.infer<typeof updateUserSchema>

export const userListSchema = z.array(userSchema)
