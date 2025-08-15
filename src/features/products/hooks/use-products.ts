import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { UpdateProduct } from '../data/schema'
import { productsApi } from '../lib/products-service'

export const useProducts = () => {
  const queryClient = useQueryClient()

  // Query para obtener todos los productos
  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['products'],
    queryFn: productsApi.list,
  })

  // Mutación para crear producto
  const createProduct = useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error) => {
      console.error('Error creating product:', error)
    },
  })

  // Mutación para actualizar producto
  const updateProduct = useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: UpdateProduct }) =>
      productsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error) => {
      console.error('Error updating product:', error)
    },
  })

  // Mutación para eliminar producto
  const deleteProduct = useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error) => {
      console.error('Error deleting product:', error)
    },
  })

  return {
    data,
    isLoading,
    error,
    createProduct: createProduct.mutate,
    updateProduct: updateProduct.mutate,
    deleteProduct: deleteProduct.mutate,
    isCreating: createProduct.isPending,
    isUpdating: updateProduct.isPending,
    isDeleting: deleteProduct.isPending,
  }
}
