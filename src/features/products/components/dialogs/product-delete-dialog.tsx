import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Product } from '../../data/schema'
import { useProducts } from '../../hooks/use-products'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product | null
}

export function ProductDeleteDialog({ open, onOpenChange, product }: Props) {
  const { deleteProduct, isDeleting } = useProducts()
  const queryClient = useQueryClient()

  const handleDelete = async () => {
    if (!product?.id) {
      toast.error('No se pudo obtener el ID del producto')
      return
    }

    try {
      await deleteProduct(product.id)
      toast.success('Producto eliminado exitosamente')
      queryClient.invalidateQueries({ queryKey: ['products'] })
      onOpenChange(false)
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Error al eliminar el producto')
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Eliminar Producto'
      desc={
        product
          ? `¿Está seguro que desea eliminar el producto "${product.codigo} - ${product.descripcion}"? Esta acción no se puede deshacer.`
          : 'Esta acción no se puede deshacer.'
      }
      confirmText='Eliminar'
      cancelBtnText='Cancelar'
      handleConfirm={handleDelete}
      isLoading={isDeleting}
      destructive={true}
    />
  )
}
