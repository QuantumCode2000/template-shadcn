import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { type NewSubsidiary, type UpdateSubsidiary } from '../data/schema'
import { subsidiariesApi } from '../lib/subsidiaries-service'

export const useSubsidiaries = () => {
  const queryClient = useQueryClient()

  // Query para obtener todas las sucursales
  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['subsidiaries'],
    queryFn: subsidiariesApi.list,
  })

  // Mutación para crear sucursal
  const createSubsidiary = useMutation({
    mutationFn: subsidiariesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subsidiaries'] })
    },
    onError: (error) => {
      console.error('Error creating subsidiary:', error)
    },
  })

  // Mutación para actualizar sucursal
  const updateSubsidiary = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string | number
      data: UpdateSubsidiary
    }) => subsidiariesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subsidiaries'] })
    },
    onError: (error) => {
      console.error('Error updating subsidiary:', error)
    },
  })

  // Mutación para eliminar sucursal
  const deleteSubsidiary = useMutation({
    mutationFn: subsidiariesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subsidiaries'] })
    },
    onError: (error) => {
      console.error('Error deleting subsidiary:', error)
    },
  })

  return {
    data,
    isLoading,
    error,
    createSubsidiary: createSubsidiary.mutate,
    updateSubsidiary: updateSubsidiary.mutate,
    deleteSubsidiary: deleteSubsidiary.mutate,
    isCreating: createSubsidiary.isPending,
    isUpdating: updateSubsidiary.isPending,
    isDeleting: deleteSubsidiary.isPending,
  }
}
