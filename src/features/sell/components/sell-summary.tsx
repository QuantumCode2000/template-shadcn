import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { SellCreateInput } from '../data/schema'

interface Props {
  values: SellCreateInput
}

export function SellSummary({ values }: Props) {
  const lineSubtotal = values.detalle.reduce(
    (acc, it) => acc + (it.precioUnitario || 0) * it.cantidad,
    0
  )
  const lineDiscounts = values.detalle.reduce(
    (acc, it) => acc + (it.montoDescuento || 0),
    0
  )
  const discount = (values.descuentoAdicional || 0) + lineDiscounts
  const gift = values.montoGiftCard || 0
  const subtotal = lineSubtotal
  const total = subtotal - discount - gift
  return (
    <Card className='sticky top-20 space-y-4 p-5'>
      <div>
        <h4 className='text-sm font-semibold'>Resumen</h4>
        <p className='text-muted-foreground text-xs'>
          Totales estimados (referencial).
        </p>
      </div>
      <div className='space-y-1 text-sm'>
        <div className='flex justify-between'>
          <span>Ítems</span>
          <span>{values.detalle.length}</span>
        </div>
        <div className='flex justify-between'>
          <span>Subtotal</span>
          <span>{subtotal.toFixed(2)}</span>
        </div>
        <div className='flex justify-between'>
          <span>Descuentos</span>
          <span>{discount.toFixed(2)}</span>
        </div>
        {gift > 0 && (
          <div className='flex justify-between'>
            <span>GiftCard</span>
            <span>{gift.toFixed(2)}</span>
          </div>
        )}
        <div className='flex justify-between border-t pt-2 font-semibold'>
          <span>Total estimado</span>
          <span>{total.toFixed(2)}</span>
        </div>
      </div>
      <div className='space-y-2'>
        <div className='flex flex-wrap gap-2'>
          {values.codigoMetodoPagoSin ? (
            <Badge variant='outline'>Pago: {values.codigoMetodoPagoSin}</Badge>
          ) : null}
          {values.codigoMonedaSin ? (
            <Badge variant='outline'>Moneda: {values.codigoMonedaSin}</Badge>
          ) : null}
          {values.codigoDocumentoSectorSin ? (
            <Badge variant='outline'>
              Doc: {values.codigoDocumentoSectorSin}
            </Badge>
          ) : null}
        </div>
      </div>
      <button
        type='submit'
        form='sell-form'
        className='bg-primary text-primary-foreground h-10 w-full rounded-md text-sm font-medium transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'
      >
        Guardar venta
      </button>
    </Card>
  )
}
