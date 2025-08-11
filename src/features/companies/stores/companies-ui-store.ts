import { create } from 'zustand'
import { Company } from '../data/schema'

export type CompaniesDialogType = 'add' | 'edit' | 'delete' | 'view'

interface CompaniesUIState {
  open: CompaniesDialogType | null
  setOpen: (o: CompaniesDialogType | null) => void
  currentRow: Company | null
  setCurrentRow: (u: Company | null) => void
}

export const useCompaniesUI = create<CompaniesUIState>((set) => ({
  open: null,
  setOpen: (o) => set({ open: o }),
  currentRow: null,
  setCurrentRow: (u) => set({ currentRow: u }),
}))
