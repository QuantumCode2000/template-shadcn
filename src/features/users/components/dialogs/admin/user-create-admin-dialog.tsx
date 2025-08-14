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
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    password_confirmation: z.string().min(6, 'Mínimo 6 caracteres'),
  })
  .refine(
    ({ password, password_confirmation }) => password === password_confirmation,
    {
      message: 'Las contraseñas no coinciden',
      path: ['password_confirmation'],
    }
  )

type UserForm = z.infer<typeof formSchema>

interface Role {
  id: number
  codigo: string
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserCreateAdminDialog({ open, onOpenChange }: Props) {
  const { createUser } = useUsers()
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Obtener empresaId del token en cookie
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

  const empresaId = getEmpresaIdFromCookie()
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
    if (!open || !canUse) return

    const fetchRoles = async () => {
      setLoading(true)
      try {
        const response = await apiService.get<any>('/roles')
        if (response.ok) {
          setRoles((response.data?.data || response.data) as Role[])
        }
      } catch (error) {
        console.error('Error fetching roles:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchRoles()
  }, [open, canUse])

  const onSubmit = async (values: UserForm) => {
    if (!empresaId) return

    setSaving(true)
    try {
      await createUser({
        ...values,
        empresaId: empresaId,
      } as any)
      toast.success('Usuario creado exitosamente')
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Error creating user:', error)
      toast.error('Error al crear el usuario')
    } finally {
      setSaving(false)
    }
  }

  if (!canUse) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>Nuevo Usuario (Admin)</DialogTitle>
          <DialogDescription>
            El usuario se asociará automáticamente a tu empresa.
          </DialogDescription>
        </DialogHeader>

        {/* {loading && (
          <div className='text-muted-foreground mb-2 text-sm'>
            Cargando roles...
          </div>
        )} */}

        <div className='-mr-4 h-[28rem] w-full overflow-y-auto py-1 pr-4'>
          <Form {...form}>
            <form
              id='user-admin-form'
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
              <FormField
                control={form.control}
                name='rolId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rol</FormLabel>
                    <SelectDropdown
                      placeholder='Selecciona rol'
                      defaultValue={field.value?.toString() || ''}
                      onValueChange={(v) => field.onChange(parseInt(v) || null)}
                      items={roles
                        .filter((r: Role) => r.codigo !== 'SUPER_ADMIN')
                        .map((r: Role) => ({
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
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder='Mínimo 6 caracteres'
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
                        placeholder='Repite la contraseña'
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
            form='user-admin-form'
            disabled={loading || saving}
          >
            {saving ? 'Creando...' : 'Crear Usuario'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
