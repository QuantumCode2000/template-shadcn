import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
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
import { User } from '../../data/schema'
import { usersApi } from '../../lib/users-service'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: User | null
}

export function UserToggleStatusDialog({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()

  if (!currentRow) return null

  const isActive = currentRow.activo
  const actionText = isActive ? 'inhabilitar' : 'habilitar'
  const confirmText = isActive ? 'Inhabilitar' : 'Habilitar'

  const handleToggleStatus = async () => {
    if (!currentRow?.id) return

    setIsLoading(true)
    try {
      await usersApi.update(currentRow.id, { activo: !isActive })

      toast.success(
        `Usuario ${isActive ? 'inhabilitado' : 'habilitado'} exitosamente`
      )

      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ['users'] })
      onOpenChange(false)
    } catch (error) {
      console.error('Error toggling user status:', error)
      toast.error(`Error al ${actionText} el usuario`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{confirmText} Usuario</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que deseas {actionText} al usuario{' '}
            <strong>
              {currentRow.nombre} {currentRow.apellido}
            </strong>
            ?
            {isActive && (
              <span className='text-destructive mt-2 block'>
                El usuario no podrá acceder al sistema una vez inhabilitado.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleToggleStatus}
            disabled={isLoading}
            className={isActive ? 'bg-destructive hover:bg-destructive/90' : ''}
          >
            {isLoading ? 'Procesando...' : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
