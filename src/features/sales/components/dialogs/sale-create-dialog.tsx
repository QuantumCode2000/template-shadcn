import { useMemo } from 'react'
import { z } from 'zod'
import Cookies from 'js-cookie'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AsyncSelectDropdown } from '@/components/async-select-dropdown'
import { SelectDropdown } from '@/components/select-dropdown'
import { useCreateSale } from '../../hooks/use-sales'
import { useSalesUI } from '../../stores/sales-ui-store'

const GIFT_METHOD_CODES = new Set([
  27, 30, 35, 40, 49, 53, 60, 64, 68, 72, 76, 77, 78, 86, 94, 102, 109, 115,
  120, 124, 128, 129, 130, 138, 146, 153, 159, 164, 168, 172, 173, 174, 182,
  189, 195, 200, 204, 208, 209, 210, 217, 222, 223, 224, 225, 226, 228, 232,
  241, 246, 250, 254, 255, 256, 261, 265, 269, 270, 271, 275, 279, 280, 281,
  285, 286, 287, 291, 292, 293, 304,
])

const saleCreateSchema = z.object({
  clienteId: z.number().min(1, 'Seleccione cliente'),
  sucursalId: z.number().min(1, 'Seleccione sucursal'),
  puntoVentaId: z.number().nullable(),
  codigoDocumentoSectorSin: z.number().min(1, 'Seleccione documento sector'),
  codigoActividadEconomicaSin: z
    .number()
    .min(1, 'Seleccione actividad económica'),
  codigoMetodoPagoSin: z.number().min(1, 'Seleccione método de pago'),
  codigoMonedaSin: z.number().min(1, 'Seleccione moneda'),
  tipoCambioSin: z.number().min(0, 'Ingrese tipo de cambio'),
  descuentoAdicional: z.number().optional().nullable(),
  montoGiftCard: z.number().optional().nullable(),
  detalle: z
    .array(
      z.object({
        productoId: z.number().min(1),
        cantidad: z.number().min(1),
        montoDescuento: z.number().optional().nullable(),
      })
    )
    .min(1, 'Agregue al menos un producto'),
})

type SaleCreateInput = z.infer<typeof saleCreateSchema>

function getEmpresaId(): number | null {
  try {
    const cookieToken = Cookies.get('thisisjustarandomstring')
    if (!cookieToken) return null
    const token = JSON.parse(cookieToken)
    const decoded = decodeToken(token)
    return decoded?.empresaId || null
  } catch {
    return null
  }
}

async function fetchBranches(empresaId: number | null) {
  if (!empresaId) return []
  const res = await apiService.get<any>(
    `/sucursales?empresa_id[eq]=${empresaId}`
  )
  if (!res.ok) throw new Error(res.message)
  const arr = res.data?.data || res.data || res
  return Array.isArray(arr) ? arr : []
}
async function fetchPos() {
  const res = await apiService.get<any>('/puntos-venta')
  if (!res.ok) throw new Error(res.message)
  const arr = res.data?.data || res.data || res
  return Array.isArray(arr) ? arr : []
}
async function fetchDocAct(empresaId: number | null) {
  if (!empresaId) return []
  const res = await apiService.get<any>(
    `/homologacion/documentos-actividades/${empresaId}`
  )
  if (!res.ok) throw new Error(res.message)
  const arr = res.data?.data || res.data || res
  return Array.isArray(arr) ? arr : []
}
async function fetchPaymentMethods() {
  const res = await apiService.get<any>('/sincronizacion/metodos-pago')
  if (!res.ok) throw new Error(res.message)
  const arr = res.data?.data || res.data || res
  return Array.isArray(arr) ? arr : []
}
async function fetchCurrencies() {
  const res = await apiService.get<any>('/sincronizacion/monedas')
  if (!res.ok) throw new Error(res.message)
  const arr = res.data?.data || res.data || res
  return Array.isArray(arr) ? arr : []
}

export function SaleCreateDialog() {
  const { open, setOpen } = useSalesUI()
  const empresaId = getEmpresaId()
  const createMutation = useCreateSale()

  const branchesQuery = useQuery({
    queryKey: ['branches', empresaId],
    queryFn: () => fetchBranches(empresaId),
    enabled: !!empresaId,
  })
  const posQuery = useQuery({ queryKey: ['pos'], queryFn: fetchPos })
  const docActQuery = useQuery({
    queryKey: ['doc-act', empresaId],
    queryFn: () => fetchDocAct(empresaId),
    enabled: !!empresaId,
  })
  const methodsQuery = useQuery({
    queryKey: ['payment-methods'],
    queryFn: fetchPaymentMethods,
  })
  const currenciesQuery = useQuery({
    queryKey: ['currencies'],
    queryFn: fetchCurrencies,
  })

  const form = useForm<SaleCreateInput>({
    resolver: zodResolver(saleCreateSchema),
    defaultValues: {
      clienteId: 0,
      sucursalId: 0,
      puntoVentaId: null,
      codigoDocumentoSectorSin: 0,
      codigoActividadEconomicaSin: 0,
      codigoMetodoPagoSin: 0,
      codigoMonedaSin: 0,
      tipoCambioSin: 1,
      descuentoAdicional: null,
      montoGiftCard: null,
      detalle: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'detalle',
  })

  const selectedMethod = form.watch('codigoMetodoPagoSin')
  const showGift = GIFT_METHOD_CODES.has(selectedMethod)

  const handleChange = (v: boolean) => {
    if (!v) {
      form.reset()
      setOpen(null)
    }
  }

  const onSubmit = async (values: SaleCreateInput) => {
    try {
      const payload = { ...values }
      await createMutation.mutateAsync(payload)
      toast.success('Venta creada')
      setOpen(null)
    } catch (e: any) {
      toast.error(e.message || 'Error al crear venta')
    }
  }

  const branchItems = (branchesQuery.data || []).map((b: any) => ({
    label: b.nombre || `Sucursal ${b.id}`,
    value: String(b.id),
  }))
  const posItems = (posQuery.data || []).map((p: any) => ({
    label: p.nombre || `POS ${p.id}`,
    value: String(p.id),
  }))
  const methodsItems = (methodsQuery.data || []).map((m: any) => ({
    label:
      m.descripcion ||
      m.descripcionSin ||
      m.nombre ||
      `Método ${m.codigoSin || m.id}`,
    value: String(m.codigoSin || m.id),
  }))
  const currencyItems = (currenciesQuery.data || []).map((c: any) => ({
    label:
      c.descripcion ||
      c.descripcionSin ||
      c.nombre ||
      `Moneda ${c.codigoSin || c.id}`,
    value: String(c.codigoSin || c.id),
  }))

  const docSecItems = (docActQuery.data || []).map((d: any) => ({
    label:
      d.descripcionDocumento ||
      d.descripcion ||
      `Doc ${d.codigoDocumentoSectorSin}`,
    value: String(d.codigoDocumentoSectorSin),
  }))
  const actividadItems = useMemo(() => {
    const currentDoc = form.watch('codigoDocumentoSectorSin')
    const source = (docActQuery.data || []).find(
      (d: any) => d.codigoDocumentoSectorSin === currentDoc
    )
    const actividades =
      source?.documentosActividadesSector || source?.actividades || []
    return (actividades || []).map((a: any) => ({
      label:
        a.descripcionActividad ||
        a.descripcion ||
        `Act ${a.codigoActividadEconomicaSin}`,
      value: String(a.codigoActividadEconomicaSin),
    }))
  }, [docActQuery.data, form.watch('codigoDocumentoSectorSin')])

  return (
    <Dialog open={open === 'create'} onOpenChange={handleChange}>
      <DialogContent className='max-h-[90vh] overflow-auto sm:max-w-3xl'>
        <DialogHeader>
          <DialogTitle>Hacer una venta</DialogTitle>
          <DialogDescription>
            Complete los datos para registrar una nueva venta.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id='sale-create-form'
            className='space-y-6'
          >
            {/* Identificación */}
            <div className='space-y-4'>
              <h4 className='text-sm font-semibold'>Identificación</h4>
              <FormField
                name='clienteId'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente *</FormLabel>
                    <AsyncSelectDropdown
                      endpoint='/clientes'
                      searchParam='numero_documento_identidad[lk]'
                      placeholder='Busca por número de documento'
                      mapItem={(c: any) => ({
                        value: String(c.id),
                        label: `${c.numeroDocumentoIdentidad || c.numero_documento_identidad} – ${c.razonSocial || c.razon_social}`,
                      })}
                      onValueChange={(v) => field.onChange(parseInt(v) || 0)}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <FormField
                  name='sucursalId'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sucursal *</FormLabel>
                      <SelectDropdown
                        placeholder='Seleccione sucursal'
                        defaultValue={field.value ? String(field.value) : ''}
                        onValueChange={(v) => field.onChange(parseInt(v) || 0)}
                        items={branchItems}
                        isControlled
                        isPending={branchesQuery.isLoading}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name='puntoVentaId'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Punto de venta</FormLabel>
                      <SelectDropdown
                        placeholder='Seleccione POS'
                        defaultValue={field.value ? String(field.value) : ''}
                        onValueChange={(v) =>
                          field.onChange(v ? parseInt(v) : null)
                        }
                        items={posItems}
                        isControlled
                        isPending={posQuery.isLoading}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Documento */}
            <div className='space-y-4'>
              <h4 className='text-sm font-semibold'>Documento</h4>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <FormField
                  name='codigoDocumentoSectorSin'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Documento sector *</FormLabel>
                      <SelectDropdown
                        placeholder='Seleccione documento sector'
                        defaultValue={field.value ? String(field.value) : ''}
                        onValueChange={(v) => field.onChange(parseInt(v) || 0)}
                        items={docSecItems}
                        isControlled
                        isPending={docActQuery.isLoading}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name='codigoActividadEconomicaSin'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Actividad económica *</FormLabel>
                      <SelectDropdown
                        placeholder='Seleccione actividad'
                        defaultValue={field.value ? String(field.value) : ''}
                        onValueChange={(v) => field.onChange(parseInt(v) || 0)}
                        items={actividadItems}
                        isControlled
                        isPending={docActQuery.isLoading}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Pago y moneda */}
            <div className='space-y-4'>
              <h4 className='text-sm font-semibold'>Pago y moneda</h4>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <FormField
                  name='codigoMetodoPagoSin'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Método de pago *</FormLabel>
                      <SelectDropdown
                        placeholder='Seleccione método'
                        defaultValue={field.value ? String(field.value) : ''}
                        onValueChange={(v) => field.onChange(parseInt(v) || 0)}
                        items={methodsItems}
                        isControlled
                        isPending={methodsQuery.isLoading}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name='codigoMonedaSin'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Moneda *</FormLabel>
                      <SelectDropdown
                        placeholder='Seleccione moneda'
                        defaultValue={field.value ? String(field.value) : ''}
                        onValueChange={(v) => field.onChange(parseInt(v) || 0)}
                        items={currencyItems}
                        isControlled
                        isPending={currenciesQuery.isLoading}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name='tipoCambioSin'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de cambio *</FormLabel>
                      <Input
                        type='number'
                        step='0.0001'
                        value={String(field.value ?? '')}
                        name={field.name}
                        onBlur={field.onBlur}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseFloat(e.target.value) : 0
                          )
                        }
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {showGift && (
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <FormField
                    name='montoGiftCard'
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monto GiftCard</FormLabel>
                        <Input
                          type='number'
                          value={field.value == null ? '' : String(field.value)}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? parseFloat(e.target.value) : null
                            )
                          }
                          onBlur={field.onBlur}
                          name={field.name}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name='descuentoAdicional'
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descuento adicional</FormLabel>
                        <Input
                          type='number'
                          value={field.value == null ? '' : String(field.value)}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? parseFloat(e.target.value) : null
                            )
                          }
                          onBlur={field.onBlur}
                          name={field.name}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            {/* Detalle */}
            <div className='space-y-4'>
              <h4 className='text-sm font-semibold'>Detalle de productos</h4>
              <div className='space-y-2'>
                {fields.map((f, idx) => (
                  <div
                    key={f.id}
                    className='grid grid-cols-12 gap-2 rounded-md border p-3'
                  >
                    <div className='col-span-5'>
                      <FormField
                        name={`detalle.${idx}.productoId`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Producto *</FormLabel>
                            <Input
                              type='number'
                              value={String(field.value ?? '')}
                              name={field.name}
                              onBlur={field.onBlur}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='col-span-3'>
                      <FormField
                        name={`detalle.${idx}.cantidad`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cantidad *</FormLabel>
                            <Input
                              type='number'
                              value={String(field.value ?? '')}
                              name={field.name}
                              onBlur={field.onBlur}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='col-span-3'>
                      <FormField
                        name={`detalle.${idx}.montoDescuento`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Desc. (opcional)</FormLabel>
                            <Input
                              type='number'
                              value={
                                field.value == null ? '' : String(field.value)
                              }
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? parseFloat(e.target.value)
                                    : null
                                )
                              }
                              onBlur={field.onBlur}
                              name={field.name}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='col-span-1 flex items-end'>
                      <Button
                        type='button'
                        variant='outline'
                        size='icon'
                        onClick={() => remove(idx)}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                type='button'
                variant='secondary'
                onClick={() =>
                  append({ productoId: 0, cantidad: 1, montoDescuento: null })
                }
              >
                Agregar ítem
              </Button>
            </div>

            {/* Total estimado */}
            <EstimatedTotals detalle={form.watch('detalle')} />
          </form>
        </Form>
        <DialogFooter>
          <Button variant='outline' type='button' onClick={() => setOpen(null)}>
            Cancelar
          </Button>
          <Button
            type='submit'
            form='sale-create-form'
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? 'Creando…' : 'Crear venta'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EstimatedTotals({
  detalle,
}: {
  detalle: {
    productoId: number
    cantidad: number
    montoDescuento?: number | null
  }[]
}) {
  const subtotal = detalle.reduce((acc, it) => acc + it.cantidad, 0)
  return (
    <div className='flex items-center justify-between rounded-md border p-4 text-sm'>
      <div className='font-medium'>Items: {detalle.length}</div>
      <div className='font-medium'>Cantidad total: {subtotal}</div>
    </div>
  )
}
