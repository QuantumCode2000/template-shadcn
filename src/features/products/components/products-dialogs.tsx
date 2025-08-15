import { useProductsUI } from '../stores/products-ui-store'
import { ProductCreateDialog } from './dialogs/product-create-dialog'
import { ProductDeleteDialog } from './dialogs/product-delete-dialog'
import { ProductEditDialog } from './dialogs/product-edit-dialog'

export function ProductsDialogs() {
  const { dialogs, closeDialog, selectedProduct } = useProductsUI()

  return (
    <>
      <ProductCreateDialog
        open={dialogs.create}
        onOpenChange={(open) => !open && closeDialog('create')}
      />

      <ProductEditDialog
        open={dialogs.edit}
        onOpenChange={(open) => !open && closeDialog('edit')}
        product={selectedProduct}
      />

      <ProductDeleteDialog
        open={dialogs.delete}
        onOpenChange={(open) => !open && closeDialog('delete')}
        product={selectedProduct}
      />
    </>
  )
}
