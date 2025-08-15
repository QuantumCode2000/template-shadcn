import { formatDateTime } from '@/lib/date-format'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useSaleById } from '../../hooks/use-sales'
import { useSalesUI } from '../../stores/sales-ui-store'

export function SaleViewDialog() {
  const { open, setOpen, selectedId } = useSalesUI()
  const { data, isLoading } = useSaleById(selectedId)
  const handleChange = (v: boolean) => {
    if (!v) setOpen(null)
  }

  return (
    <Dialog open={open === 'view'} onOpenChange={handleChange}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Detalle de la venta</DialogTitle>
          <DialogDescription>Información completa.</DialogDescription>
        </DialogHeader>
        {isLoading && (
          <div className='text-muted-foreground text-sm'>Cargando…</div>
        )}
        {!isLoading && data && (
          <div className='space-y-4 text-sm'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <span className='font-medium'>Cliente:</span> {data.clienteId}
              </div>
              <div>
                <span className='font-medium'>Sucursal:</span> {data.sucursalId}
              </div>
              <div>
                <span className='font-medium'>Punto Venta:</span>{' '}
                {data.puntoVentaId ?? '—'}
              </div>
              <div>
                <span className='font-medium'>Documento Sector:</span>{' '}
                {data.codigoDocumentoSectorSin}
              </div>
              <div>
                <span className='font-medium'>Actividad Económica:</span>{' '}
                {data.codigoActividadEconomicaSin}
              </div>
              <div>
                <span className='font-medium'>Método Pago:</span>{' '}
                {data.codigoMetodoPagoSin}
              </div>
              <div>
                <span className='font-medium'>Moneda:</span>{' '}
                {data.codigoMonedaSin}
              </div>
              <div>
                <span className='font-medium'>Tipo Cambio:</span>{' '}
                {data.tipoCambioSin}
              </div>
              {data.descuentoAdicional != null && (
                <div>
                  <span className='font-medium'>Desc. adicional:</span>{' '}
                  {data.descuentoAdicional}
                </div>
              )}
              {data.montoGiftCard != null && (
                <div>
                  <span className='font-medium'>Monto GiftCard:</span>{' '}
                  {data.montoGiftCard}
                </div>
              )}
              <div>
                <span className='font-medium'>Emisión:</span>{' '}
                {formatDateTime(data.fechaEmision)}
              </div>
              <div>
                <span className='font-medium'>Creado:</span>{' '}
                {formatDateTime(data.createdAt)}
              </div>
              <div>
                <span className='font-medium'>Actualizado:</span>{' '}
                {formatDateTime(data.updatedAt)}
              </div>
            </div>
            <div>
              <h4 className='mb-2 font-semibold'>Detalle</h4>
              <div className='space-y-2'>
                {data.detalle.map((it, i) => (
                  <div
                    key={i}
                    className='flex items-center justify-between rounded-md border p-2'
                  >
                    <div className='text-xs'>Producto: {it.productoId}</div>
                    <div className='text-xs'>Cant: {it.cantidad}</div>
                    {it.montoDescuento != null && (
                      <div className='text-xs'>Desc: {it.montoDescuento}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
