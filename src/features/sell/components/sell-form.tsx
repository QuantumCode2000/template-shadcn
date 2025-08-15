import { useEffect } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Form } from '@/components/ui/form'
import { sellCreateSchema, SellCreateInput } from '../data/schema'
import {
  useBranches,
  useDocActivity,
  usePaymentMethods,
  useCurrencies,
  usePosList,
} from '../hooks/use-sell'
import { useCreateSell } from '../hooks/use-sell'
import { useSellUIStore } from '../stores/sell-ui-store'
import { SectionDocument } from './sections/section-document'
import { SectionIdentification } from './sections/section-identification'
import { SectionItems } from './sections/section-items'
import { SectionPayment } from './sections/section-payment'
import { SellSummary } from './sell-summary'

export function SellForm() {
  const form = useForm<SellCreateInput>({
    // Cast para evitar conflicto de tipos transitorio (precioUnitario opcional vs requerido)
    resolver: zodResolver(sellCreateSchema) as any,
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
    mode: 'onChange',
  })
  const { setDirty } = useSellUIStore()
  const navigate = useNavigate()

  useEffect(() => {
    const sub = form.watch(() => setDirty(true))
    return () => sub.unsubscribe()
  }, [form, setDirty])

  const branchesQuery = useBranches()
  const posQuery = usePosList()
  const docActQuery = useDocActivity()
  const methodsQuery = usePaymentMethods()
  const currenciesQuery = useCurrencies()
  const createMutation = useCreateSell()

  const onSubmit: SubmitHandler<SellCreateInput> = async (values) => {
    try {
      // Normalizar valores opcionales
      const normalized: SellCreateInput = {
        ...values,
        descuentoAdicional:
          values.descuentoAdicional == null || values.descuentoAdicional <= 0
            ? (undefined as any)
            : values.descuentoAdicional,
        montoGiftCard:
          values.montoGiftCard == null || values.montoGiftCard <= 0
            ? (undefined as any)
            : values.montoGiftCard,
        detalle: values.detalle.map((d) => ({
          ...d,
          montoDescuento:
            d.montoDescuento == null || d.montoDescuento <= 0
              ? undefined
              : d.montoDescuento,
        })),
      }
      const res = await createMutation.mutateAsync(normalized)
      toast.success('Venta creada')
      setDirty(false)
      // Navegar: si hay id
      const id = res?.id
      if (id) navigate({ to: '/sales' })
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
  const docAct = docActQuery.data || []
  const methodItems = (methodsQuery.data || []).map((m: any) => ({
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

  return (
    <Form {...form}>
      <form
        id='sell-form'
        onSubmit={form.handleSubmit(onSubmit as any) as any}
        className='grid gap-6 md:grid-cols-3'
      >
        <div className='space-y-6 md:col-span-2'>
          <div className='bg-card rounded-2xl border p-6 shadow-sm'>
            <SectionIdentification
              form={form}
              branchItems={branchItems}
              posItems={posItems}
            />
          </div>
          <div className='bg-card rounded-2xl border p-6 shadow-sm'>
            <SectionDocument form={form} docAct={docAct} />
          </div>
          <div className='bg-card rounded-2xl border p-6 shadow-sm'>
            <SectionPayment
              form={form}
              methodItems={methodItems}
              currencyItems={currencyItems}
            />
          </div>
          <div className='bg-card rounded-2xl border p-6 shadow-sm'>
            <SectionItems form={form} />
          </div>
        </div>
        <div className='md:col-span-1'>
          <SellSummary values={form.getValues()} />
        </div>
      </form>
    </Form>
  )
}
