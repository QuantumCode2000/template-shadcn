import { create } from 'zustand'

export type SaleDialogType = 'create' | 'view' | null

interface SalesUIState {
  open: SaleDialogType
  setOpen: (o: SaleDialogType) => void
  selectedId: number | null
  setSelectedId: (id: number | null) => void
}

export const useSalesUI = create<SalesUIState>((set) => ({
  open: null,
  setOpen: (o) => set({ open: o }),
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}))
