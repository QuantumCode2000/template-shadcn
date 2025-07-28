import { useSubsidiariesUI } from '@/stores/subsidiaries-ui-store'
import { SubsidiaryCreateDialog } from './dialogs/subsidiary-create-dialog'
import { SubsidiaryDeleteDialog } from './dialogs/subsidiary-delete-dialog'
import { SubsidiaryEditDialog } from './dialogs/subsidiary-edit-dialog'

export function SubsidiariesDialogs() {
  const { subsidiaries, setOpen } = useSubsidiariesUI()

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setOpen(null)
    }
  }

  return (
    <>
      <SubsidiaryCreateDialog
        open={subsidiaries.open === 'add'}
        onOpenChange={handleOpenChange}
      />
      <SubsidiaryEditDialog
        open={subsidiaries.open === 'edit'}
        onOpenChange={handleOpenChange}
      />
      <SubsidiaryDeleteDialog
        open={subsidiaries.open === 'delete'}
        onOpenChange={handleOpenChange}
      />
    </>
  )
}
