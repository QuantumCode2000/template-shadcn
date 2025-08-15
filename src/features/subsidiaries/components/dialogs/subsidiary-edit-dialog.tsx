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
import { SelectDropdown } from '@/components/select-dropdown'
import { useSubsidiaries } from '../../context/use-subsidiaries'
import { type Subsidiary } from '../../data/schema'
import { useSubsidiariesUI } from '../../stores/subsidiaries-ui-store'

interface Company {
  id: number
  nombre: string
}

const formSchema = z.object({
  empresaId: z.number().min(1, 'La empresa es obligatoria'),
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

export function SubsidiaryEditDialog({ open, onOpenChange }: Props) {
  const { updateSubsidiary } = useSubsidiaries()
  const { subsidiaries } = useSubsidiariesUI()
  const [empresas, setEmpresas] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)

  const selectedSubsidiary = subsidiaries.selectedSubsidiary as Subsidiary

  const form = useForm<SubsidiaryForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      empresaId: 0,
      codigo: undefined as any,
      nombre: '',
      municipio: '',
      direccion: '',
      telefono: undefined as any,
      codigoSin: undefined as any,
    },
  })

  useEffect(() => {
    if (!open) return
    const fetchEmpresas = async () => {
      setLoading(true)
      try {
        const response = await apiService.get('/empresas')
        if (!response.ok) throw new Error(response.message)
        const empresasData = (response.data as any)?.data || response.data || []
        setEmpresas(empresasData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching companies:', error)
        setEmpresas([])
        setLoading(false)
      }
    }
    fetchEmpresas()
  }, [open])

  useEffect(() => {
    if (selectedSubsidiary && open) {
      form.reset({
        empresaId: selectedSubsidiary.empresaId,
        codigo: selectedSubsidiary.codigo,
        nombre: selectedSubsidiary.nombre,
        municipio: selectedSubsidiary.municipio,
        direccion: selectedSubsidiary.direccion,
        telefono: selectedSubsidiary.telefono,
        codigoSin: selectedSubsidiary.codigoSin,
      })
    }
  }, [selectedSubsidiary, form, open])

  const onSubmit = async (values: SubsidiaryForm) => {
    if (!selectedSubsidiary) return

    try {
      // @ts-ignore - Temporal mientras se actualiza el schema
      await updateSubsidiary({ id: selectedSubsidiary.id, data: values as any })
      toast.success('Sucursal actualizada exitosamente')
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating subsidiary:', error)
      toast.error('Error al actualizar la sucursal')
    }
  }

  if (!selectedSubsidiary) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader className='text-left'>
          <DialogTitle>Editar Sucursal</DialogTitle>
          <DialogDescription>
            Modifica los datos de la sucursal
          </DialogDescription>
        </DialogHeader>

        <div className='-mr-4 h-[28rem] w-full overflow-y-auto py-1 pr-4'>
          <Form {...form}>
            <form
              id='subsidiary-edit-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'
            >
              <div className='grid grid-cols-2 gap-4'>
                {/* Empresa */}
                <FormField
                  control={form.control}
                  name='empresaId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Empresa</FormLabel>
                      <FormControl>
                        <SelectDropdown
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          defaultValue={field.value?.toString()}
                          placeholder='Selecciona una empresa'
                          isPending={loading}
                          items={empresas.map((empresa) => ({
                            label: empresa.nombre,
                            value: empresa.id.toString(),
                          }))}
                          isControlled={true}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Código */}
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
              </div>

              <div className='grid grid-cols-2 gap-4'>
                {/* Nombre */}
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

                {/* Municipio */}
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
              </div>

              {/* Dirección */}
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

              <div className='grid grid-cols-2 gap-4'>
                {/* Teléfono */}
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

                {/* Código SIN */}
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
          <Button type='submit' form='subsidiary-edit-form'>
            Actualizar Sucursal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
