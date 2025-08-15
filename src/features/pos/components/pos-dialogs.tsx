import { PosCreateDialog } from './dialogs/pos-create-dialog'
import { PosDeleteDialog } from './dialogs/pos-delete-dialog'
import { PosViewDialog } from './dialogs/pos-view-dialog'

export function PosDialogs() {
  return (
    <>
      <PosViewDialog />
      <PosCreateDialog />
      <PosDeleteDialog />
    </>
  )
}
