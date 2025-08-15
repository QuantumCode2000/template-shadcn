import { create } from 'zustand'
import { Product } from '../data/schema'

export type ProductsDialogType = 'create' | 'edit' | 'delete'

interface ProductsUIState {
  // Dialog states
  dialogs: {
    create: boolean
    edit: boolean
    delete: boolean
  }
  selectedProduct: Product | null

  // Actions
  openDialog: (type: ProductsDialogType, product?: Product) => void
  closeDialog: (type: ProductsDialogType) => void
  setSelectedProduct: (product: Product | null) => void
}

export const useProductsUI = create<ProductsUIState>((set) => ({
  dialogs: {
    create: false,
    edit: false,
    delete: false,
  },
  selectedProduct: null,

  openDialog: (type, product = undefined) =>
    set((state) => ({
      dialogs: {
        ...state.dialogs,
        [type]: true,
      },
      selectedProduct: product || null,
    })),

  closeDialog: (type) =>
    set((state) => ({
      dialogs: {
        ...state.dialogs,
        [type]: false,
      },
      selectedProduct: type !== 'create' ? null : state.selectedProduct,
    })),

  setSelectedProduct: (product) => set({ selectedProduct: product }),
}))
