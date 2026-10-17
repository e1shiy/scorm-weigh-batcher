import { create } from 'zustand'
import type { DeviceId, ValveId } from '../../../scenario/objects'

type PopUpState = {
  isOpen: boolean
  objectId: DeviceId | ValveId | null
}

type PopUpActions = {
  setIsOpen: (value: boolean) => void
  setObjectId: (id: DeviceId | ValveId) => void
}

export const usePopUpStore = create<PopUpState & PopUpActions>(set => ({
  isOpen: false,
  objectId: null,
  
  setIsOpen: value => set({ isOpen: value }),
  setObjectId: id => set({ objectId: id })
}))
