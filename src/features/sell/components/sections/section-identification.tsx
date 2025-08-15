import { UseFormReturn } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { AsyncSelectDropdown } from '@/components/async-select-dropdown'
import { SelectDropdown } from '@/components/select-dropdown'
import { SellCreateInput } from '../../data/schema'
import { SellCustomerCard } from '../sell-customer-card'

interface Props {
  form: UseFormReturn<SellCreateInput>
  branchItems: any[]
  posItems: any[]
}

export function SectionIdentification({ form, branchItems, posItems }: Props) {
  const watchCliente = form.watch('clienteId')
  return (
    <div className='space-y-4'>
      <div>
        <h4 className='text-sm font-semibold'>Identificación</h4>
        <p className='text-muted-foreground text-xs'>
          Datos básicos de la venta.
        </p>
      </div>
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
      {watchCliente ? <SellCustomerCard id={watchCliente} /> : null}
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
                onValueChange={(v) => field.onChange(v ? parseInt(v) : null)}
                items={posItems}
                isControlled
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
