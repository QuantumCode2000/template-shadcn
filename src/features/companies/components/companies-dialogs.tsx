import { useCompaniesUI } from '@/stores/companies-ui-store'
import { useCompanies } from '@/features/companies/context/use-companies'
import { CompanyCreateDialog } from './dialogs/company-create-dialog'
import { CompanyDeleteDialog } from './dialogs/company-delete-dialog'
import { CompanyEditDialog } from './dialogs/company-edit-dialog'
import { CompanyViewDialog } from './dialogs/company-view-dialog'

export function CompaniesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCompaniesUI()
  const { deleteCompany } = useCompanies()

  /* callback genérico para todos los diálogos */
  const handleChange =
    (type: 'add' | 'edit' | 'view' | 'delete') => (v: boolean) => {
      if (v) {
        // el propio botón externo ya dejó open en 'add' / 'edit' / etc
        return
      }
      setOpen(null) // ✔️ cierra
      setCurrentRow(null) // ✔️ limpia fila
    }

  const handleDelete = async () => {
    if (currentRow) {
      try {
        await deleteCompany(currentRow.id)
        setOpen(null)
        setCurrentRow(null)
      } catch (error) {
        console.error('Error deleting company:', error)
      }
    }
  }

  return (
    <>
      {/* Crear */}
      <CompanyCreateDialog
        open={open === 'add'}
        onOpenChange={handleChange('add')}
      />

      {/* Ver detalles */}
      <CompanyViewDialog
        open={open === 'view'}
        onOpenChange={handleChange('view')}
        company={currentRow}
      />

      {/* Editar */}
      <CompanyEditDialog
        open={open === 'edit'}
        onOpenChange={handleChange('edit')}
        company={currentRow}
      />

      {/* Eliminar */}
      <CompanyDeleteDialog
        open={open === 'delete'}
        onOpenChange={handleChange('delete')}
        company={currentRow}
        onConfirm={handleDelete}
      />
    </>
  )
}
