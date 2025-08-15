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
import { useSubsidiariesUI } from '../../stores/subsidiaries-ui-store'

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

export function SubsidiaryEditAdminDialog({ open, onOpenChange }: Props) {
  const { updateSubsidiary, isUpdating } = useSubsidiaries()
  const { subsidiaries } = useSubsidiariesUI()
  const subsidiary = subsidiaries.selectedSubsidiary

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
  const isAdmin = decoded?.rolId === 2
  const canUse = isAdmin && empresaId

  const form = useForm<SubsidiaryForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codigo: undefined as any,
      nombre: '',
      municipio: '',
      direccion: '',
      telefono: undefined as any,
      codigoSin: undefined as any,
    },
  })

  useEffect(() => {
    if (open && subsidiary) {
      form.reset({
        codigo: subsidiary.codigo || 0,
        nombre: subsidiary.nombre || '',
        municipio: subsidiary.municipio || '',
        direccion: subsidiary.direccion || '',
        telefono: subsidiary.telefono || 0,
        codigoSin: subsidiary.codigoSin || 0,
      })
    }
    if (!open) form.reset()
  }, [open, subsidiary])

  const onSubmit = async (values: SubsidiaryForm) => {
    if (!subsidiary?.id || !empresaId) return

    // Verify the subsidiary belongs to the same company as the admin
    if (subsidiary.empresaId !== empresaId) {
      toast.error('No puedes editar sucursales de otra empresa')
      return
    }

    try {
      // @ts-ignore schema pending update to include empresaId
      await updateSubsidiary({
        id: subsidiary.id,
        data: { ...values, empresaId: Number(empresaId) },
      })
      toast.success('Sucursal actualizada exitosamente')
      form.reset()
      onOpenChange(false)
    } catch (e) {
      console.error('Error editing subsidiary (admin)', e)
      toast.error('Error al editar la sucursal')
    }
  }

  if (!canUse) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader className='text-left'>
          <DialogTitle>Editar Sucursal (Admin)</DialogTitle>
          <DialogDescription>
            La sucursal permanecerá asociada a tu empresa.
          </DialogDescription>
        </DialogHeader>
        <div className='-mr-4 h-[28rem] w-full overflow-y-auto py-1 pr-4'>
          <Form {...form}>
            <form
              id='subsidiary-admin-edit-form'
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
                          value={field.value === undefined ? '' : field.value}
                          onChange={(e) => {
                            const val = e.target.value
                            if (val === '')
                              return field.onChange(undefined as any)
                            const num = Number(val)
                            field.onChange(isNaN(num) ? undefined : num)
                          }}
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
                          value={field.value === undefined ? '' : field.value}
                          onChange={(e) => {
                            const val = e.target.value
                            if (val === '')
                              return field.onChange(undefined as any)
                            const num = Number(val)
                            field.onChange(isNaN(num) ? undefined : num)
                          }}
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
                          value={field.value === undefined ? '' : field.value}
                          onChange={(e) => {
                            const val = e.target.value
                            if (val === '')
                              return field.onChange(undefined as any)
                            const num = Number(val)
                            field.onChange(isNaN(num) ? undefined : num)
                          }}
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
            form='subsidiary-admin-edit-form'
            disabled={isUpdating}
          >
            {isUpdating ? 'Guardando…' : 'Guardar Cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
