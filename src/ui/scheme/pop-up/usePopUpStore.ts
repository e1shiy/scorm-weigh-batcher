import { create } from 'zustand'
import type { ObjectId } from '../../../scenario/objects'

type PopUpState = {
  isOpen: boolean
  objectId: ObjectId | null
}

type PopUpActions = {
  setIsOpen: (value: boolean, objectId: ObjectId) => void
}

export const usePopUpStore = create<PopUpState & PopUpActions>(set => ({
  isOpen: false,
  objectId: null,
  setIsOpen: (value, objectId) => set({ isOpen: value, objectId })
}))
