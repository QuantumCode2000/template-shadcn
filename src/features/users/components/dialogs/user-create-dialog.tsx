import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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

const formSchema = z
  .object({
    nombre: z.string().min(1, 'El nombre es obligatorio'),
    paterno: z.string().min(1, 'El apellido paterno es obligatorio'),
    materno: z.string().min(1, 'El apellido materno es obligatorio'),
    usuario: z.string().min(1, 'El usuario es obligatorio'),
    email: z.string().email('Correo electrónico inválido'),
    ci: z.string().min(1, 'El CI es obligatorio'),
    sexo: z.enum(['Femenino', 'Masculino']),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    password_confirmation: z.string(),
    roles_ids: z.array(z.number()).min(1, 'Selecciona al menos un rol'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ['password_confirmation'],
    message: 'Las contraseñas no coinciden',
  })

type UserForm = z.infer<typeof formSchema>

interface Role {
  id: number
  nombre: string
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserCreateDialog({ open, onOpenChange }: Props) {
  const { createUser } = useUsers()
  const [roles, setRoles] = useState<Role[]>([])

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
      password: '',
      password_confirmation: '',
      roles_ids: [],
    },
  })

  useEffect(() => {
    const fetchRoles = async () => {
      const res =
        await apiService.get<{ id: number; nombre: string }[]>('/roles')
      if (res.ok) setRoles(res.data)
    }
    if (open) fetchRoles()
  }, [open])

  const onSubmit = async (values: UserForm) => {
    // const { password_confirmation, ...payload } = values
    await createUser({
      ...values,
      codigo_pais: null,
      whatsapp: null,
      expedido: null,
    })
    showSubmittedData(values)
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>Nuevo usuario</DialogTitle>
          <DialogDescription>
            Llena los datos del nuevo usuario
          </DialogDescription>
        </DialogHeader>

        <div className='-mr-4 h-[26rem] w-full overflow-y-auto py-1 pr-4'>
          <Form {...form}>
            <form
              id='user-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'
            >
              {/* nombre */}
              <FormField
                control={form.control}
                name='nombre'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder='Juan Carlos' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* materno y paterno */}
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='materno'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Materno</FormLabel>
                      <FormControl>
                        <Input placeholder='Perez' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='paterno'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paterno</FormLabel>
                      <FormControl>
                        <Input placeholder='Fernández' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* usuario y ci */}
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='usuario'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Usuario</FormLabel>
                      <FormControl>
                        <Input placeholder='juancarlos01' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='ci'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CI</FormLabel>
                      <FormControl>
                        <Input placeholder='8954321' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* email */}
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='juancarlos@email.com' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* sexo y roles */}
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='sexo'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sexo</FormLabel>
                      <SelectDropdown
                        defaultValue={field.value}
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
                        placeholder='Selecciona uno o más roles'
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

              {/* contraseña */}
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder='********' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* confirmar contraseña */}
              <FormField
                control={form.control}
                name='password_confirmation'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar contraseña</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder='********' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <DialogFooter>
          <Button type='submit' form='user-form'>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
