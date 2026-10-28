import { create } from 'zustand'
import type { DeviceId, ValveId } from '../../../scenario/objects'
import type { PopUpPosition, SchemeRect } from './popUpPosition'

type PopUpState = {
  isOpen: boolean
  objectId: DeviceId | ValveId | null
  position: PopUpPosition | null
  focusRect: SchemeRect | null
}

type PopUpActions = {
  setIsOpen: (value: boolean) => void
  setObjectId: (id: DeviceId | ValveId) => void
  setPosition: (position: PopUpPosition) => void
  setFocusRect: (rect: SchemeRect | null) => void
}

export const usePopUpStore = create<PopUpState & PopUpActions>(set => ({
  isOpen: false,
  objectId: null,
  position: null,
  focusRect: null,

  setIsOpen: value => set({ isOpen: value }),
  setObjectId: id => set({ objectId: id, position: null }),
  setPosition: position => set({ position }),
  setFocusRect: rect => set({ focusRect: rect })
}))
