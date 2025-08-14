import { useEffect, useState } from 'react'
import { z } from 'zod'
import Cookies from 'js-cookie'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import apiService from '@/lib/apiService'
import { decodeToken } from '@/lib/jwtUtils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { SelectDropdown } from '@/components/select-dropdown'
import { useUsers } from '../../../hooks/use-users'

const formSchema = z
  .object({
    nombre: z.string().min(1, 'El nombre es obligatorio'),
    apellido: z.string().min(1, 'El apellido es obligatorio'),
    usuario: z.string().min(1, 'El usuario es obligatorio'),
    email: z.string().email('Correo electrónico inválido'),
    rolId: z.number().nullable().optional(),
    password: z.string().optional(),
    password_confirmation: z.string().optional(),
  })
  .superRefine(({ password, password_confirmation }, ctx) => {
    if (password || password_confirmation) {
      if (!password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'La contraseña es obligatoria si deseas cambiarla',
          path: ['password'],
        })
      }
      if (password && password.length < 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Mínimo 6 caracteres',
          path: ['password'],
        })
      }
      if (password !== password_confirmation) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Las contraseñas no coinciden',
          path: ['password_confirmation'],
        })
      }
    }
  })

type UserForm = z.infer<typeof formSchema>

interface Role {
  id: number
  codigo: string
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId?: number | string
}

export function UserEditAdminDialog({ open, onOpenChange, userId }: Props) {
  const { getUser, updateUser } = useUsers()
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Verificar permisos de admin
  function getEmpresaIdFromCookie(): number | null {
    try {
      const cookieToken = Cookies.get('thisisjustarandomstring')
      if (!cookieToken) return null
      const token = JSON.parse(cookieToken)
      const decoded = decodeToken(token)
      return decoded?.empresaId ?? null
    } catch {
      return null
    }
  }

  const isAdmin = (() => {
    try {
      const cookieToken = Cookies.get('thisisjustarandomstring')
      if (!cookieToken) return false
      const token = JSON.parse(cookieToken)
      const decoded = decodeToken(token)
      return decoded?.rolId === 2
    } catch {
      return false
    }
  })()

  const empresaId = getEmpresaIdFromCookie()
  const canUse = isAdmin && empresaId

  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: '',
      apellido: '',
      usuario: '',
      email: '',
      rolId: null,
      password: '',
      password_confirmation: '',
    },
  })

  useEffect(() => {
    if (!open || !userId || !canUse) return

    const fetchData = async () => {
      setLoading(true)
      try {
        const [rolesRes, user] = await Promise.all([
          apiService.get<any>('/roles'),
          getUser(userId),
        ])
        if (rolesRes.ok)
          setRoles((rolesRes.data?.data || rolesRes.data) as Role[])

        form.reset({
          nombre: user.nombre,
          apellido: user.apellido,
          usuario: user.usuario,
          email: user.email,
          rolId: user.rol?.id || null,
          password: '',
          password_confirmation: '',
        })
      } catch (e) {
        console.error('Error cargando usuario:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [open, userId, canUse])

  const onSubmit = async (values: UserForm) => {
    if (!userId) return
    const { dirtyFields } = form.formState
    const payload: any = {}
    ;(['nombre', 'apellido', 'usuario', 'email', 'rolId'] as const).forEach(
      (k) => {
        if (dirtyFields[k]) (payload as any)[k] = (values as any)[k]
      }
    )
    if (values.password) {
      payload.password = values.password
      payload.password_confirmation = values.password_confirmation
    }
    if (Object.keys(payload).length === 0) return
    try {
      setSaving(true)
      await updateUser({ id: userId, body: payload })
      toast.success('Usuario actualizado exitosamente')
      onOpenChange(false)
    } catch (e) {
      console.error('Error al actualizar usuario', e)
      toast.error('Error al actualizar el usuario')
    } finally {
      setSaving(false)
    }
  }

  const isDirty = Object.keys(form.formState.dirtyFields).length > 0

  if (!canUse) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>Editar usuario (Admin)</DialogTitle>
          <DialogDescription>
            Actualiza los datos del usuario (empresa fija).
          </DialogDescription>
        </DialogHeader>

        {/* {loading && (
          <div className='text-muted-foreground mb-2 text-sm'>Cargando...</div>
        )} */}

        <div className='-mr-4 h-[28rem] w-full overflow-y-auto py-1 pr-4'>
          <Form {...form}>
            <form
              id='user-edit-admin-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >
              <FormField
                control={form.control}
                name='nombre'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder='Ej: Juan Carlos' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='apellido'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input placeholder='Ej: Pérez' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='usuario'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuario</FormLabel>
                    <FormControl>
                      <Input placeholder='Ej: juan.perez' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='ej: juan.perez@email.com'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Empresa FIJA (no editable para admin) */}
              <div className='grid grid-cols-1 gap-4'>
                <FormField
                  control={form.control}
                  name='rolId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rol</FormLabel>
                      <SelectDropdown
                        placeholder='Selecciona rol'
                        defaultValue={field.value?.toString() || ''}
                        onValueChange={(v) =>
                          field.onChange(parseInt(v) || null)
                        }
                        items={roles.map((r: Role) => ({
                          value: r.id.toString(),
                          label: r.codigo,
                        }))}
                        isPending={loading}
                        isControlled
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Password */}
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nueva contraseña (opcional)</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder='Déjalo vacío para no cambiar'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password_confirmation'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar contraseña</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder='Repite la nueva contraseña'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button
            type='submit'
            form='user-edit-admin-form'
            disabled={loading || saving || !isDirty}
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
