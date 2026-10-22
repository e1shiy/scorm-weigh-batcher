import { create } from 'zustand'

export interface ToastData {
  id: string
  message: string
}

interface ToastState {
  toasts: ToastData[]
}

interface ToastActions {
  addToast: (toast: Omit<ToastData, 'id'>) => void
  removeToast: (id: string) => void
  clear: () => void
}

export const useToastStore = create<ToastState & ToastActions>((set, get) => ({
  toasts: [],
  addToast: toast => set({ toasts: [...get().toasts, { id: crypto.randomUUID(), ...toast }] }),
  removeToast: id => set({ toasts: [...get().toasts.filter(t => t.id !== id)] }),
  clear: () => set({ toasts: [] })
}))
