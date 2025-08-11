import { create } from 'zustand'

type SubsidiariesDialogType = 'add' | 'edit' | 'delete'

interface SubsidiariesUIState {
  selectedSubsidiary: any | null
  open: SubsidiariesDialogType | null
  multipleSelection: any[]
}

interface SubsidiariesUIActions {
  setOpen: (dialog: SubsidiariesDialogType | null) => void
  setSelectedSubsidiary: (subsidiary: any) => void
  setMultipleSelection: (subsidiaries: any[]) => void
  reset: () => void
}

interface SubsidiariesUIStore {
  subsidiaries: SubsidiariesUIState
}

const initialState: SubsidiariesUIState = {
  selectedSubsidiary: null,
  open: null,
  multipleSelection: [],
}

export const useSubsidiariesUI = create<
  SubsidiariesUIStore & SubsidiariesUIActions
>((set) => ({
  subsidiaries: initialState,
  setOpen: (dialog) =>
    set((state) => ({
      subsidiaries: { ...state.subsidiaries, open: dialog },
    })),
  setSelectedSubsidiary: (subsidiary) =>
    set((state) => ({
      subsidiaries: { ...state.subsidiaries, selectedSubsidiary: subsidiary },
    })),
  setMultipleSelection: (subsidiaries) =>
    set((state) => ({
      subsidiaries: { ...state.subsidiaries, multipleSelection: subsidiaries },
    })),
  reset: () =>
    set(() => ({
      subsidiaries: initialState,
    })),
}))
