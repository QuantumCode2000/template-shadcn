// stores/users-ui-store.ts
import { create } from 'zustand'
import { User } from '@/features/users/data/schema'

export type UsersDialogType = 'add' | 'edit' | 'delete' | 'invite'

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
