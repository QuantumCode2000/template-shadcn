import { formatDateTime } from '@/lib/date-format'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { usePosById } from '../../hooks/use-pos'
import { usePosUI } from '../../stores/pos-ui-store'

export function PosViewDialog() {
  const { open, setOpen, selectedId } = usePosUI()
  const { data, isLoading } = usePosById(selectedId)
  const handleChange = (v: boolean) => {
    if (!v) setOpen(null)
  }

  return (
    <Dialog open={open === 'view'} onOpenChange={handleChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Detalle del punto de venta</DialogTitle>
          <DialogDescription>
            Información completa de solo lectura.
          </DialogDescription>
        </DialogHeader>
        {isLoading && (
          <div className='text-muted-foreground text-sm'>Cargando…</div>
        )}
        {!isLoading && data && (
          <div className='space-y-2 text-sm'>
            <div>
              <span className='font-medium'>ID:</span> {data.id}
            </div>
            <div>
              <span className='font-medium'>Código SIN:</span> {data.codigoSin}
            </div>
            <div>
              <span className='font-medium'>Nombre:</span> {data.nombre}
            </div>
            <div>
              <span className='font-medium'>Descripción:</span>{' '}
              {data.descripcion || '—'}
            </div>
            <div>
              <span className='font-medium'>Tipo:</span> {data.tipo}
            </div>
            <div>
              <span className='font-medium'>Sucursal:</span> {data.sucursalId}
            </div>
            <div>
              <span className='font-medium'>Activo:</span>{' '}
              {data.activo ? 'Sí' : 'No'}
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
        )}
      </DialogContent>
    </Dialog>
  )
}
