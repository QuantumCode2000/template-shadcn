import { create } from 'zustand'

export type PosDialogType = 'view' | 'delete' | 'create' | 'edit' | null

interface PosUIState {
  open: PosDialogType
  setOpen: (o: PosDialogType) => void
  selectedId: number | null
  setSelectedId: (id: number | null) => void
}

export const usePosUI = create<PosUIState>((set) => ({
  open: null,
  setOpen: (o) => set({ open: o }),
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}))
