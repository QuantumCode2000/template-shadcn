import { useUsersUI } from '../stores/users-ui-store'
import { UserCreateAdminDialog } from './dialogs/admin/user-create-admin-dialog'
import { UserEditAdminDialog } from './dialogs/admin/user-edit-admin-dialog'
import { UserCreateDialog } from './dialogs/user-create-dialog'
import { UserEditDialog } from './dialogs/user-edit-dialog'
import { UserToggleStatusDialog } from './dialogs/user-toggle-status-dialog'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useUsersUI()

  /* callback genérico para todos los diálogos */
  const handleChange = (v: boolean) => {
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
      <UserCreateDialog open={open === 'add'} onOpenChange={handleChange} />

      {/* Crear Admin */}
      <UserCreateAdminDialog
        open={open === 'add-admin'}
        onOpenChange={handleChange}
      />

      {/* Editar */}
      <UserEditDialog
        open={open === 'edit'}
        onOpenChange={handleChange}
        userId={currentRow?.id ?? ''}
      />

      {/* Editar Admin */}
      <UserEditAdminDialog
        open={open === 'edit-admin'}
        onOpenChange={handleChange}
        userId={currentRow?.id ?? ''}
      />

      {/* Toggle Status */}
      <UserToggleStatusDialog
        open={open === 'toggle-status'}
        onOpenChange={handleChange}
        currentRow={currentRow}
      />

      {/* Si luego añades delete / invite:
          <UserDeleteDialog
            open={open === 'delete'}
            onOpenChange={handleChange}
            userId={currentRow?.id ?? ''}
          />
      */}
    </>
  )
}
