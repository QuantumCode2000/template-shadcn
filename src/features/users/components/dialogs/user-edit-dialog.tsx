import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import apiService from '@/lib/apiService'
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
import { useUsers } from '../../hooks/use-users'

const formSchema = z
  .object({
    nombre: z.string().min(1, 'El nombre es obligatorio'),
    apellido: z.string().min(1, 'El apellido es obligatorio'),
    usuario: z.string().min(1, 'El usuario es obligatorio'),
    email: z.string().email('Correo electrónico inválido'),
    empresaId: z.number().nullable().optional(),
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
interface Company {
  id: number
  nombre: string
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId?: number | string
}

export function UserEditDialog({ open, onOpenChange, userId }: Props) {
  const { getUser, updateUser } = useUsers()
  const [roles, setRoles] = useState<Role[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: '',
      apellido: '',
      usuario: '',
      email: '',
      empresaId: null,
      rolId: null,
      password: '',
      password_confirmation: '',
    },
  })

  useEffect(() => {
    if (!open || !userId) return

    const fetchData = async () => {
      setLoading(true)
      try {
        const [rolesRes, companiesRes, user] = await Promise.all([
          apiService.get<any>('/roles'),
          apiService.get<any>('/empresas'),
          getUser(userId),
        ])
        if (rolesRes.ok)
          setRoles((rolesRes.data?.data || rolesRes.data) as Role[])
        if (companiesRes.ok)
          setCompanies(
            (companiesRes.data?.data || companiesRes.data) as Company[]
          )

        form.reset({
          nombre: user.nombre,
          apellido: user.apellido,
          usuario: user.usuario,
          email: user.email,
          empresaId: user.empresa?.id || user.empresaId || null,
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
  }, [open, userId])

  const onSubmit = async (values: UserForm) => {
    if (!userId) return
    const { dirtyFields } = form.formState
    const payload: any = {}
    ;(
      ['nombre', 'apellido', 'usuario', 'email', 'empresaId', 'rolId'] as const
    ).forEach((k) => {
      if (dirtyFields[k]) (payload as any)[k] = (values as any)[k]
    })
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>Editar usuario</DialogTitle>
          <DialogDescription>Actualiza los datos del usuario</DialogDescription>
        </DialogHeader>

        {/* {loading && (
          <div className='text-muted-foreground mb-2 text-sm'>Cargando...</div>
        )} */}

        <div className='-mr-4 h-[28rem] w-full overflow-y-auto py-1 pr-4'>
          <Form {...form}>
            <form
              id='user-edit-form'
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
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='empresaId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Empresa</FormLabel>
                      <SelectDropdown
                        placeholder='Selecciona empresa'
                        defaultValue={field.value?.toString() || ''}
                        onValueChange={(v) =>
                          field.onChange(parseInt(v) || null)
                        }
                        items={companies.map((c) => ({
                          value: c.id.toString(),
                          label: c.nombre,
                        }))}
                        isPending={loading}
                        isControlled
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                        items={roles.map((r) => ({
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
            form='user-edit-form'
            disabled={loading || saving || !isDirty}
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
