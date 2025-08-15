import { useCustomerById } from '../hooks/use-sell'

export function SellCustomerCard({ id }: { id: number | null }) {
  const { data, isLoading } = useCustomerById(id)
  if (!id) return null
  if (isLoading)
    return (
      <div className='text-muted-foreground text-xs'>Cargando cliente…</div>
    )
  if (!data) return null
  return (
    <div className='bg-muted/30 grid gap-1 rounded-md border p-3 text-xs md:grid-cols-4 md:text-[11px]'>
      <div>
        <span className='font-semibold'>Tipo:</span>{' '}
        {data.tipoDocumentoIdentidadDescripcion ||
          data.codigoDocumentoIdentidadSin}
      </div>
      <div>
        <span className='font-semibold'>Nro:</span>{' '}
        {data.numeroDocumentoIdentidad}
      </div>
      <div>
        <span className='font-semibold'>Razón Social:</span> {data.razonSocial}
      </div>
      {data.celular && (
        <div>
          <span className='font-semibold'>Cel:</span> {data.celular}
        </div>
      )}
    </div>
  )
}
