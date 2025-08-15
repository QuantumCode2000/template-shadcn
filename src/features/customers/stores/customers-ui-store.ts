import { create } from 'zustand'

interface CustomersUIState {
  openQuickCreate: boolean
  setOpenQuickCreate: (v: boolean) => void
  selectedCustomerId: number | null
  setSelectedCustomerId: (id: number | null) => void
}

export const useCustomersUI = create<CustomersUIState>((set) => ({
  openQuickCreate: false,
  setOpenQuickCreate: (v) => set({ openQuickCreate: v }),
  selectedCustomerId: null,
  setSelectedCustomerId: (id) => set({ selectedCustomerId: id }),
}))
