import { create } from 'zustand'
import { User } from '../data/schema'

export type UsersDialogType =
  | 'add'
  | 'add-admin'
  | 'edit'
  | 'edit-admin'
  | 'delete'
  | 'invite'
  | 'toggle-status'

interface UsersUIState {
  open: UsersDialogType | null
  setOpen: (o: UsersDialogType | null) => void
  currentRow: User | null
  setCurrentRow: (u: User | null) => void
}

export const useUsersUI = create<UsersUIState>((set) => ({
  open: null,
  setOpen: (o) => set({ open: o }),
  currentRow: null,
  setCurrentRow: (u) => set({ currentRow: u }),
}))
