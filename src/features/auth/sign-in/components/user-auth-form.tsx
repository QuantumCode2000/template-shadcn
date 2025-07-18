import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'
import apiService from '@/lib/apiService'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
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

type UserAuthFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z.object({
  usuario: z.string().min(1, { message: 'Por favor, ingresa tu usuario' }),
  password: z
    .string()
    .min(1, {
      message: 'Por favor, ingresa tu contraseña',
    })
    .min(7, {
      message: 'La contraseña debe tener al menos 7 caracteres',
    }),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      usuario: '',
      password: '',
    },
  })

  const navigate = useNavigate()

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const result = await apiService.post<any>('/login', data)
      if (result.ok && result.data && result.data.token) {
        useAuthStore.getState().auth.setUser(result.data)
        useAuthStore.getState().auth.setAccessToken(result.data.token)
        localStorage.setItem('authToken', result.data.token)
        navigate({ to: '/' })
      } else {
        alert(result.message || 'Error de autenticación')
      }
    } catch (error: any) {
      alert(error?.message || 'Error de autenticación')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        {/* 3. Campo de formulario actualizado para 'usuario' */}
        <FormField
          control={form.control}
          name='usuario'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usuario</FormLabel>
              <FormControl>
                <Input placeholder='usuario' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='text-muted-foreground absolute -top-0.5 right-0 text-sm font-medium hover:opacity-75'
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          Iniciar Sesión
        </Button>
      </form>
    </Form>
  )
}
