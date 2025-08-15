import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useDeletePos } from '../../hooks/use-pos'
import { usePosUI } from '../../stores/pos-ui-store'

export function PosDeleteDialog() {
  const { open, setOpen, selectedId, setSelectedId } = usePosUI()
  const mutation = useDeletePos()
  const handleChange = (v: boolean) => {
    if (!v) {
      setOpen(null)
      setSelectedId(null)
    }
  }

  const onDelete = async () => {
    if (!selectedId) return
    try {
      await mutation.mutateAsync(selectedId)
      toast.success('Punto de venta eliminado')
      setOpen(null)
      setSelectedId(null)
    } catch (e: any) {
      toast.error(e.message || 'Error al eliminar')
    }
  }

  return (
    <Dialog open={open === 'delete'} onOpenChange={handleChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Eliminar punto de venta</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <div className='text-sm'>
          ¿Está seguro que desea eliminar este punto de venta (id: {selectedId}
          )?
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(null)}>
            Cancelar
          </Button>
          <Button
            variant='destructive'
            onClick={onDelete}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Eliminando…' : 'Eliminar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
