import { useEffect, useState } from 'react'
import { z } from 'zod'
import Cookies from 'js-cookie'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
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
import { SelectDropdown } from '@/components/select-dropdown'
import { ProductoSin, ActividadSin, UnidadMedidaSin } from '../../data/schema'
import { useProducts } from '../../hooks/use-products'
import { productsApi } from '../../lib/products-service'

const formSchema = z.object({
  codigo: z.string().min(1, 'El código es obligatorio'),
  descripcion: z.string().min(1, 'La descripción es obligatoria'),
  precioUnitario: z.number().min(0.01, 'El precio debe ser mayor a 0'),
  codigoProductoSin: z.number().min(1, 'Seleccione un producto SIN'),
  codigoActividadSin: z.number().min(1, 'Seleccione una actividad SIN'),
  codigoUnidadMedida: z.number().min(1, 'Seleccione una unidad de medida'),
})

type ProductForm = z.infer<typeof formSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductCreateDialog({ open, onOpenChange }: Props) {
  const { createProduct, isCreating } = useProducts()
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const [productos, setProductos] = useState<ProductoSin[]>([])
  const [actividades, setActividades] = useState<ActividadSin[]>([])
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedidaSin[]>([])

  const form = useForm<ProductForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codigo: '',
      descripcion: '',
      precioUnitario: undefined as any,
      codigoProductoSin: 0,
      codigoActividadSin: 0,
      codigoUnidadMedida: 0,
    },
  })

  // Obtener empresaId del token
  const empresaId = (() => {
    try {
      const cookieToken = Cookies.get('thisisjustarandomstring')
      if (!cookieToken) return null
      const token = JSON.parse(cookieToken)
      const decoded = decodeToken(token)
      return decoded?.empresaId ?? null
    } catch {
      return null
    }
  })()

  useEffect(() => {
    if (!open || !empresaId) return

    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Obtener productos y actividades SIN
        const homologacion = await productsApi.getHomologacion(empresaId)

        // La respuesta puede venir directamente o con estructura de datos
        if (
          homologacion.data &&
          homologacion.data.actividades &&
          homologacion.data.productos
        ) {
          setProductos(homologacion.data.productos)
          setActividades(homologacion.data.actividades)
        } else if (
          (homologacion as any).actividades &&
          (homologacion as any).productos
        ) {
          setProductos((homologacion as any).productos)
          setActividades((homologacion as any).actividades)
        }

        // Obtener unidades de medida
        const unidades = await productsApi.getUnidadesMedida()

        // La respuesta puede venir como array directo o con estructura de datos
        if (Array.isArray(unidades)) {
          setUnidadesMedida(unidades)
        } else if (unidades.data && Array.isArray(unidades.data)) {
          setUnidadesMedida(unidades.data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Error al cargar los datos necesarios')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [open, empresaId])

  const onSubmit = async (values: ProductForm) => {
    if (!empresaId) {
      toast.error('No se pudo obtener la empresa del usuario')
      return
    }

    try {
      await createProduct({
        ...values,
        empresaId,
      })
      toast.success('Producto creado exitosamente')
      queryClient.invalidateQueries({ queryKey: ['products'] })
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Error creating product:', error)
      toast.error('Error al crear el producto')
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset()
    }
    onOpenChange(open)
  }

  // Filtrar productos según actividad seleccionada
  const productosOptions = productos
    .filter(
      (p) =>
        form.watch('codigoActividadSin') === 0 ||
        p.codigo_actividad_sin === form.watch('codigoActividadSin')
    )
    .map((p) => ({
      label: p.descripcion_sin,
      value: String(p.codigo_sin),
    }))

  const actividadesOptions = actividades.map((a) => ({
    label: a.descripcion_sin,
    value: String(a.codigo_sin),
  }))

  const unidadesOptions = unidadesMedida.map((u) => ({
    label: u.descripcionSin,
    value: String(u.codigoSin),
  }))

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Crear Producto</DialogTitle>
          <DialogDescription>
            Agregue un nuevo producto al sistema.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className='flex justify-center py-6'>
            <div className='text-muted-foreground text-sm'>
              Cargando datos...
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='codigo'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Ej: SYN-001' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='descripcion'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='Descripción del producto'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='precioUnitario'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio Unitario *</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='0.01'
                        min='0'
                        placeholder='0.00'
                        value={field.value === undefined ? '' : field.value}
                        onChange={(e) => {
                          const val = e.target.value
                          if (val === '') {
                            field.onChange(undefined as any)
                            return
                          }
                          const num = parseFloat(val)
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
                name='codigoActividadSin'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Actividad SIN *</FormLabel>
                    <SelectDropdown
                      placeholder='Seleccione una actividad'
                      defaultValue={field.value ? String(field.value) : ''}
                      onValueChange={(value) => {
                        const numValue = parseInt(value) || 0
                        field.onChange(numValue)
                        // Reset producto when activity changes
                        form.setValue('codigoProductoSin', 0)
                      }}
                      items={actividadesOptions}
                      isControlled={true}
                      key={`actividad-${field.value}`} // Force re-render when value changes
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='codigoProductoSin'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Producto SIN *</FormLabel>
                    <SelectDropdown
                      placeholder='Seleccione un producto'
                      defaultValue={field.value ? String(field.value) : ''}
                      onValueChange={(value) => {
                        const numValue = parseInt(value) || 0
                        field.onChange(numValue)
                      }}
                      items={productosOptions}
                      disabled={!form.watch('codigoActividadSin')}
                      isControlled={true}
                      key={`producto-${field.value}-${form.watch('codigoActividadSin')}`} // Force re-render
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='codigoUnidadMedida'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidad de Medida *</FormLabel>
                    <SelectDropdown
                      placeholder='Seleccione una unidad'
                      defaultValue={field.value ? String(field.value) : ''}
                      onValueChange={(value) => {
                        const numValue = parseInt(value) || 0
                        field.onChange(numValue)
                      }}
                      items={unidadesOptions}
                      isControlled={true}
                      key={`unidad-${field.value}`} // Force re-render when value changes
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => handleOpenChange(false)}
                >
                  Cancelar
                </Button>
                <Button type='submit' disabled={isCreating}>
                  {isCreating ? 'Creando...' : 'Crear Producto'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
