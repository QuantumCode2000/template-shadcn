import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { SelectDropdown } from '@/components/select-dropdown'
import { useUsers } from '../../hooks/use-users'

interface Company {
  id: number
  nombre: string
}

const formSchema = z
  .object({
    nombre: z.string().min(1, 'El nombre es obligatorio'),
    apellido: z.string().min(1, 'El apellido es obligatorio'),
    usuario: z.string().min(1, 'El usuario es obligatorio'),
    email: z.string().email('Correo electrónico inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    password_confirmation: z.string().min(6, 'Mínimo 6 caracteres'),
    empresaId: z.number().min(1, 'La empresa es obligatoria'),
  })
  .superRefine(({ password, password_confirmation }, ctx) => {
    if (password !== password_confirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Las contraseñas no coinciden',
        path: ['password_confirmation'],
      })
    }
  })

type UserForm = z.infer<typeof formSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserCreateDialog({ open, onOpenChange }: Props) {
  const { createUser } = useUsers()
  const [empresas, setEmpresas] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: '',
      apellido: '',
      usuario: '',
      email: '',
      password: '',
      password_confirmation: '',
      empresaId: 0,
    },
  })

  useEffect(() => {
    if (!open) return
    const fetchEmpresas = async () => {
      setLoading(true)
      try {
        const response = await apiService.get('/empresas')
        if (!response.ok) throw new Error(response.message)
        // La respuesta de la API de empresas tiene la estructura { data: { data: [...] } }
        const empresasData = (response.data as any)?.data || response.data || []
        setEmpresas(empresasData)
        console.log('Empresas fetched:', empresasData)

        setLoading(false)
      } catch (error) {
        console.error('Error fetching companies:', error)
        setEmpresas([])
        setLoading(false)
      }
    }
    fetchEmpresas()
  }, [open, form])

  const onSubmit = async (values: UserForm) => {
    try {
      // Removemos password_confirmation antes de enviar
      const { password_confirmation, ...submitData } = values

      // Usamos el hook de React Query para crear el usuario
      // @ts-ignore - Temporal mientras se actualiza el schema
      await createUser(submitData as any)

      // Si todo sale bien, resetea el formulario y cierra el diálogo
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Error al crear el usuario')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader className='text-left'>
          <DialogTitle>Nuevo usuario</DialogTitle>
          <DialogDescription>
            Llena los datos del nuevo usuario
          </DialogDescription>
        </DialogHeader>

        <div className='-mr-4 h-[28rem] w-full overflow-y-auto py-1 pr-4'>
          <Form {...form}>
            <form
              id='user-form'
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
                      <Input placeholder='Ej: Juan' {...field} />
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

              {/* Usuario y Email */}
              <div className='grid grid-cols-2 gap-4'>
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
                        <Input placeholder='juan@ejemplo.com' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Contraseñas */}
              <div className='grid grid-cols-2 gap-4'>
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
                      <FormLabel>Confirmar Contraseña</FormLabel>
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
              </div>

              {/* Empresa */}
              <FormField
                control={form.control}
                name='empresaId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa</FormLabel>
                    <FormDescription>
                      Selecciona la empresa a la que pertenecerá este usuario
                    </FormDescription>
                    <SelectDropdown
                      placeholder='Selecciona una empresa'
                      items={empresas.map((empresa) => ({
                        value: empresa.id.toString(),
                        label: empresa.nombre,
                      }))}
                      defaultValue={field.value?.toString() || ''}
                      onValueChange={(value) =>
                        field.onChange(parseInt(value) || 0)
                      }
                      isPending={loading}
                      isControlled={true}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <DialogFooter>
          <Button type='submit' form='user-form'>
            Crear Usuario
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
