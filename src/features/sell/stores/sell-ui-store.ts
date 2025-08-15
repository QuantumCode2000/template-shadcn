import { create } from 'zustand'

interface SellUIState {
  dirty: boolean
  setDirty: (v: boolean) => void
}

export const useSellUIStore = create<SellUIState>((set) => ({
  dirty: false,
  setDirty: (v) => set({ dirty: v }),
}))
