import { useEffect } from 'react'
import { z } from 'zod'
import Cookies from 'js-cookie'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
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
import { useSubsidiaries } from '../../context/use-subsidiaries'

const formSchema = z.object({
  codigo: z.number().min(1, 'El código es obligatorio'),
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  municipio: z.string().min(1, 'El municipio es obligatorio'),
  direccion: z.string().min(1, 'La dirección es obligatoria'),
  telefono: z.number().min(1, 'El teléfono es obligatorio'),
  codigoSin: z.number().min(0, 'El código SIN es obligatorio'),
})

type SubsidiaryForm = z.infer<typeof formSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SubsidiaryCreateAdminDialog({ open, onOpenChange }: Props) {
  const { createSubsidiary, isCreating } = useSubsidiaries()
  const rawToken = (() => {
    try {
      const cookieToken = Cookies.get('thisisjustarandomstring')
      if (!cookieToken) return null
      return JSON.parse(cookieToken)
    } catch {
      return null
    }
  })()
  const decoded = rawToken ? decodeToken(rawToken) : null
  const empresaId = decoded?.empresaId
  const isAdmin = decoded?.rolId === 2 // Ajustar si cambia la lógica de roles
  const canUse = isAdmin && empresaId

  const form = useForm<SubsidiaryForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codigo: 0,
      nombre: '',
      municipio: '',
      direccion: '',
      telefono: 0,
      codigoSin: 0,
    },
  })

  useEffect(() => {
    if (!open) form.reset()
  }, [open])

  const onSubmit = async (values: SubsidiaryForm) => {
    if (!empresaId) return
    try {
      // @ts-ignore schema pending update to include empresaId
      await createSubsidiary({ ...values, empresaId: Number(empresaId) })
      toast.success('Sucursal creada exitosamente')
      form.reset()
      onOpenChange(false)
    } catch (e) {
      console.error('Error creating subsidiary (admin)', e)
      toast.error('Error al crear la sucursal')
    }
  }

  if (!canUse) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader className='text-left'>
          <DialogTitle>Nueva Sucursal (Admin)</DialogTitle>
          <DialogDescription>
            La sucursal se asociará automáticamente a tu empresa.
          </DialogDescription>
        </DialogHeader>
        <div className='-mr-4 h-[28rem] w-full overflow-y-auto py-1 pr-4'>
          <Form {...form}>
            <form
              id='subsidiary-admin-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'
            >
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='codigo'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='1400'
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='nombre'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder='Sucursal Central' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='municipio'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Municipio</FormLabel>
                      <FormControl>
                        <Input placeholder='La Paz' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='direccion'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input placeholder='Av. Principal #123' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='telefono'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='22785566'
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='codigoSin'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código SIN</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='2'
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button
            type='submit'
            form='subsidiary-admin-form'
            disabled={isCreating}
          >
            {isCreating ? 'Creando…' : 'Crear Sucursal'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
