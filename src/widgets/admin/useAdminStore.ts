import { create } from 'zustand'

type AdminState = {
  isAdmin: boolean
}

type AdminActions = {
  setIsAdmin: (value: boolean) => void
}

export const useAdminStore = create<AdminState & AdminActions>(set => ({
  isAdmin: false,
  setIsAdmin: value => set({ isAdmin: value })
}))
