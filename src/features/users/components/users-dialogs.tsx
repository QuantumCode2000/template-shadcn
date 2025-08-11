import { useUsersUI } from '../stores/users-ui-store'
import { UserCreateDialog } from './dialogs/user-create-dialog'
import { UserEditDialog } from './dialogs/user-edit-dialog'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useUsersUI()

  /* callback genérico para todos los diálogos */
  const handleChange =
    (type: 'add' | 'edit' /* | 'delete' | 'invite' */) => (v: boolean) => {
      if (v) {
        // el propio botón externo ya dejó open en 'add' / 'edit'
        return
      }
      setOpen(null) // ✔️ cierra
      setCurrentRow(null) // ✔️ limpia fila
    }

  return (
    <>
      {/* Crear */}
      <UserCreateDialog
        open={open === 'add'}
        onOpenChange={handleChange('add')}
      />

      {/* Editar */}
      <UserEditDialog
        open={open === 'edit'}
        onOpenChange={handleChange('edit')}
        userId={currentRow?.id ?? ''}
      />

      {/* Si luego añades delete / invite:
          <UserDeleteDialog
            open={open === 'delete'}
            onOpenChange={handleChange('delete')}
            userId={currentRow?.id ?? ''}
          />
      */}
    </>
  )
}
