import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle } from 'lucide-react'
import apiService from '@/lib/apiService'
import { showSubmittedData } from '@/utils/show-submitted-data'
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
import { MultiSelectDropdown } from '@/components/multi-select-dropdown'
import { PasswordInput } from '@/components/password-input'
import { SelectDropdown } from '@/components/select-dropdown'
import { useUsers } from '../../context/use-users'
import { paises, expedidos } from '../../data/data'
import { User } from '../../data/schema'

const formSchema = z
  .object({
    nombre: z.string().min(1, 'El nombre es obligatorio'),
    paterno: z.string().min(1, 'El apellido paterno es obligatorio'),
    materno: z.string().min(1, 'El apellido materno es obligatorio'),
    usuario: z.string().min(1, 'El usuario es obligatorio'),
    email: z.string().email('Correo electrónico inválido'),
    ci: z.string().min(1, 'El CI es obligatorio'),
    sexo: z.enum(['Femenino', 'Masculino']),
    codigo_pais: z.string().nullable().optional(),
    whatsapp: z.string().nullable().optional(),
    expedido: z.string().nullable().optional(),
    password: z.string().optional(),
    password_confirmation: z.string().optional(),
    roles_ids: z.array(z.number()).min(1, 'Selecciona al menos un rol'),
  })
  .superRefine(({ password, password_confirmation }, ctx) => {
    if (password !== '' || password_confirmation !== '') {
      if (password === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password is required.',
          path: ['password'],
        })
      }

      if (password && password.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'La contraseña debe tener al menos 8 caracteres.',
          path: ['password'],
        })
      }

      if (password && !password.match(/[a-z]/)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'La contraseña debe contener al menos una letra minúscula.',
          path: ['password'],
        })
      }

      if (password && !password.match(/\d/)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'La contraseña debe contener al menos un número.',
          path: ['password'],
        })
      }

      if (password !== password_confirmation) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Las contraseñas no coinciden.',
          path: ['password_confirmation'],
        })
      }
    }
  })

type UserForm = z.infer<typeof formSchema>

interface Role {
  id: number
  nombre: string
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId?: number | string
}

function extractRoleIds(user: User): number[] {
  if (Array.isArray(user.roles_ids)) {
    return user.roles_ids
  }
  if (Array.isArray(user.roles)) {
    return user.roles
      .map((role) => (typeof role === 'object' && role.id ? role.id : role))
      .filter((id): id is number => typeof id === 'number')
  }
  return []
}

export function UserEditDialog({ open, onOpenChange, userId }: Props) {
  const { updateUser } = useUsers()
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(false)
  const [warningFields, setWarningFields] = useState<string[]>([])

  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: '',
      paterno: '',
      materno: '',
      usuario: '',
      email: '',
      ci: '',
      sexo: 'Femenino',
      codigo_pais: '',
      whatsapp: '',
      expedido: '',
      password: '',
      password_confirmation: '',
      roles_ids: [],
    },
  })

  const isPasswordTouched =
    form.formState.touchedFields.password ||
    form.formState.touchedFields.password_confirmation

  useEffect(() => {
    if (!open || !userId) return

    const fetchData = async () => {
      setLoading(true)
      try {
        const [rolesRes, userRes] = await Promise.all([
          apiService.get<Role[]>('/roles'),
          apiService.get<User>(`/users/${userId}`),
        ])

        if (rolesRes.ok) setRoles(rolesRes.data)

        if (userRes.ok) {
          const user = userRes.data
          const requiredFields = [
            'nombre',
            'paterno',
            'materno',
            'usuario',
            'email',
            'ci',
          ]

          const incomplete = Object.keys(user).filter(
            (key) =>
              requiredFields.includes(key) &&
              (user[key as keyof User] === null ||
                user[key as keyof User] === '')
          )
          setWarningFields(incomplete)

          const userRolesIds = extractRoleIds(user)

          form.reset({
            ...user,
            nombre: user.nombre || '',
            paterno: user.paterno || '',
            materno: user.materno || '',
            usuario: user.usuario || '',
            email: user.email || '',
            ci: user.ci || '',
            codigo_pais: user.codigo_pais || '',
            whatsapp: user.whatsapp || '',
            expedido: user.expedido || '',
            password: '',
            password_confirmation: '',
            roles_ids: userRolesIds,
          })
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [open, userId, form])

  const onSubmit = async (values: UserForm) => {
    const { dirtyFields } = form.formState
    const partialData: Partial<UserForm> = {}
    if (dirtyFields.nombre) partialData.nombre = values.nombre
    if (dirtyFields.paterno) partialData.paterno = values.paterno
    if (dirtyFields.materno) partialData.materno = values.materno
    if (dirtyFields.usuario) partialData.usuario = values.usuario
    if (dirtyFields.email) partialData.email = values.email
    if (dirtyFields.ci) partialData.ci = values.ci
    if (dirtyFields.sexo) partialData.sexo = values.sexo
    if (dirtyFields.roles_ids) partialData.roles_ids = values.roles_ids
    if (dirtyFields.codigo_pais) partialData.codigo_pais = values.codigo_pais
    if (dirtyFields.whatsapp) partialData.whatsapp = values.whatsapp
    if (dirtyFields.expedido) partialData.expedido = values.expedido

    if (dirtyFields.password) {
      partialData.password = values.password
      partialData.password_confirmation = values.password_confirmation
    }

    if (Object.keys(partialData).length === 0) return

    if (!userId) {
      console.error(
        'No se puede actualizar: el ID del usuario no está definido.'
      )
      return
    }
    console.log(userId)
    const id = userId
    const ok = await updateUser(id, partialData)

    if (ok) {
      showSubmittedData(partialData)
      form.reset()
      onOpenChange(false)
    }
  }

  const incompleteFieldsLabels: Record<string, string> = {
    nombre: 'Nombre',
    paterno: 'Paterno',
    materno: 'Materno',
    usuario: 'Usuario',
    email: 'Email',
    ci: 'CI',
    sexo: 'Sexo',
    codigo_pais: 'Código país',
    whatsapp: 'Whatsapp',
    expedido: 'Expedido',
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>Editar usuario</DialogTitle>
          <DialogDescription>Actualiza los datos del usuario</DialogDescription>
        </DialogHeader>

        {warningFields.length > 0 && (
          <div className='mb-2 flex items-center gap-2 rounded bg-yellow-50 px-3 py-2 text-yellow-700'>
            <AlertCircle className='h-5 w-5 text-yellow-600' />
            <div>
              <b>Este usuario debe completar:</b>{' '}
              {warningFields
                .map((k) => incompleteFieldsLabels[k] || k)
                .join(', ')}
            </div>
          </div>
        )}

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
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='paterno'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paterno</FormLabel>
                      <FormControl>
                        <Input placeholder='Ej: Pérez' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='materno'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Materno</FormLabel>
                      <FormControl>
                        <Input placeholder='Ej: Soliz' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='grid grid-cols-12 gap-4'>
                <div className='col-span-5'>
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
                </div>
                <div className='col-span-5'>
                  <FormField
                    control={form.control}
                    name='ci'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CI</FormLabel>
                        <FormControl>
                          <Input placeholder='Ej: 11223344' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='col-span-2'>
                  <FormField
                    control={form.control}
                    name='expedido'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exp.</FormLabel>
                        <SelectDropdown
                          defaultValue={field.value || ''}
                          onValueChange={field.onChange}
                          placeholder='Exp.'
                          className='min-w-[65px]'
                          items={expedidos}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
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
                  name='codigo_pais'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código país</FormLabel>
                      {/* ✅ Se usa 'value' para componentes controlados */}
                      <SelectDropdown
                        defaultValue={field.value || ''}
                        onValueChange={field.onChange}
                        placeholder='Selecciona país'
                        items={paises}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='whatsapp'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Whatsapp</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Ej: 78999999'
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='sexo'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sexo</FormLabel>
                      {/* ✅ Se usa 'value' para componentes controlados */}
                      <SelectDropdown
                        defaultValue={field.value || ''}
                        onValueChange={field.onChange}
                        placeholder='Selecciona sexo'
                        items={[
                          { label: 'Femenino', value: 'Femenino' },
                          { label: 'Masculino', value: 'Masculino' },
                        ]}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='roles_ids'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Roles</FormLabel>
                      <MultiSelectDropdown
                        value={field.value.map(String)}
                        onChange={(val) => field.onChange(val.map(Number))}
                        placeholder='Selecciona roles'
                        items={roles.map((r) => ({
                          label: r.nombre,
                          value: r.id.toString(),
                        }))}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                        disabled={!isPasswordTouched}
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
          <Button type='submit' form='user-edit-form' disabled={loading}>
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
