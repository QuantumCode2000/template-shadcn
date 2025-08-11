import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useSubsidiaries } from '../../context/use-subsidiaries'
import { type Subsidiary } from '../../data/schema'
import { useSubsidiariesUI } from '../../stores/subsidiaries-ui-store'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SubsidiaryDeleteDialog({ open, onOpenChange }: Props) {
  const { deleteSubsidiary } = useSubsidiaries()
  const { subsidiaries } = useSubsidiariesUI()

  const selectedSubsidiary = subsidiaries.selectedSubsidiary as Subsidiary

  const handleDelete = async () => {
    if (!selectedSubsidiary) return

    try {
      await deleteSubsidiary(selectedSubsidiary.id)
      onOpenChange(false)
    } catch (error) {
      console.error('Error deleting subsidiary:', error)
      alert('Error al eliminar la sucursal')
    }
  }

  if (!selectedSubsidiary) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente la
            sucursal <strong>{selectedSubsidiary.nombre}</strong> y todos los
            datos relacionados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className='bg-red-600 hover:bg-red-700'
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
