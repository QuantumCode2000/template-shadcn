import { useCompanies } from '@/features/companies/context/use-companies'
import { useCompaniesUI } from '../stores/companies-ui-store'
import { CompanyCreateDialog } from './dialogs/company-create-dialog'
import { CompanyDeleteDialog } from './dialogs/company-delete-dialog'
import { CompanyEditDialog } from './dialogs/company-edit-dialog'
import { CompanyViewDialog } from './dialogs/company-view-dialog'

export function CompaniesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCompaniesUI()
  const { deleteCompany } = useCompanies()

  /* callback genérico para todos los diálogos */
  const handleChange = () => (v: boolean) => {
    if (v) return // el botón externo ya gestionó abrir
    setOpen(null)
    setCurrentRow(null)
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
        onOpenChange={handleChange()}
      />

      {/* Ver detalles */}
      <CompanyViewDialog
        open={open === 'view'}
        onOpenChange={handleChange()}
        company={currentRow}
      />

      {/* Editar */}
      <CompanyEditDialog
        open={open === 'edit'}
        onOpenChange={handleChange()}
        company={currentRow}
      />

      {/* Eliminar */}
      <CompanyDeleteDialog
        open={open === 'delete'}
        onOpenChange={handleChange()}
        company={currentRow}
        onConfirm={handleDelete}
      />
    </>
  )
}
