import { useEffect, useRef, useState, type RefObject } from 'react'

export type CollapsiblePanelState = {
  isOpen: boolean
  open: () => void
  close: () => void
  expandToggleRef: RefObject<HTMLButtonElement | null>
  collapseToggleRef: RefObject<HTMLButtonElement | null>
}

export function useCollapsiblePanel(isNarrow: boolean): CollapsiblePanelState {
  const [choice, setChoice] = useState<'auto' | 'open' | 'closed'>('auto')
  const expandToggleRef = useRef<HTMLButtonElement>(null)
  const collapseToggleRef = useRef<HTMLButtonElement>(null)
  const restoreFocusRef = useRef(false)

  const isOpen = choice === 'auto' ? !isNarrow : choice === 'open'

  const setOpen = (nextIsOpen: boolean) => {
    restoreFocusRef.current = true
    setChoice(nextIsOpen ? 'open' : 'closed')
  }

  useEffect(() => {
    if (!restoreFocusRef.current) return
    restoreFocusRef.current = false
    ;(isOpen ? expandToggleRef.current : collapseToggleRef.current)?.focus()
  }, [isOpen])

  return {
    isOpen,
    open: () => setOpen(true),
    close: () => setOpen(false),
    expandToggleRef,
    collapseToggleRef
  }
}
