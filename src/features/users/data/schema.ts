import { z } from 'zod'

const userSexSchema = z.union([z.literal('Masculino'), z.literal('Femenino')])

export const userStatusSchema = z.union([z.literal('active'), z.literal('inactive')])

const userSchema = z.object({
  id: z.string(),
  nombre: z.string().nullable(),
  paterno: z.string().nullable(),
  materno: z.string().nullable(),
  usuario: z.string().nullable(),
  email: z.string().nullable(),
  codigo_pais: z.string().nullable(),
  whatsapp: z.string().nullable(),
  ci: z.string().nullable(),
  complemento: z.string().optional().nullable(),

  expedido: z.string().nullable(),

  sexo: userSexSchema,
  avatar: z.string().optional().nullable(),
  email_verified_at: z.coerce.date().optional().nullable(),
  estado: z.boolean(),
  created_at: z.coerce.date().nullable(),
  updated_at: z.coerce.date().nullable(),
  roles: z
    .array(
      z.object({
        id: z.number(),
        nombre: z.string(),
      })
    )
    .optional(),
  roles_ids: z.array(z.number()).optional(),
  avatar_url: z.string().optional(),
  password: z.string().optional(),
  password_confirmation: z.string().optional(),
})

// --- El resto de tus esquemas derivados ya no necesitan cambios ---

const newUserSchema = userSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  email_verified_at: true,
  avatar: true,
  avatar_url: true,
  estado: true,
})

const updateUserSchema = newUserSchema.partial() // .partial() ya es suficiente

export type User = z.infer<typeof userSchema>
export type NewUser = z.infer<typeof newUserSchema>
export type UpdateUser = z.infer<typeof updateUserSchema>

export const userListSchema = z.array(userSchema)
