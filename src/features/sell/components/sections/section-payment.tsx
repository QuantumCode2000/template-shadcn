import { UseFormReturn } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SelectDropdown } from '@/components/select-dropdown'
import { GIFT_METHOD_CODES } from '../../data/data'
import { SellCreateInput } from '../../data/schema'

interface Props {
  form: UseFormReturn<SellCreateInput>
  methodItems: any[]
  currencyItems: any[]
}

export function SectionPayment({ form, methodItems, currencyItems }: Props) {
  const method = form.watch('codigoMetodoPagoSin')
  const showGift = GIFT_METHOD_CODES.has(method)
  return (
    <div className='space-y-4'>
      <div>
        <h4 className='text-sm font-semibold'>Pago y moneda</h4>
        <p className='text-muted-foreground text-xs'>Configuración del pago.</p>
      </div>
      <div className='grid gap-4 md:grid-cols-3'>
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
                items={methodItems}
                isControlled
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
        <div className='grid gap-4 md:grid-cols-2'>
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
  )
}
