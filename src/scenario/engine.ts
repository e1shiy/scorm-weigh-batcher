import { useToastStore } from '../ui/components/toast/useToastStore'
import type { ObjectId } from './objects'
import type { steps } from './steps'
import type { Action, ObjectChange, Step } from './types'

// Возвращает новый прогресс и засчитанные действия, либо null, если действие неверное.
export const applyChange = <Id extends ObjectId>(step: Step, progress: boolean[][], change: ObjectChange<Id>) => {
  const matches = (action: Action | undefined) => !!action && action.objectId === change.id && action.check(change.status, change.value)

  const next = progress.map(done => [...done])
  const matched: Action[] = []

  // exclusive: пока sequence-группа начата, но не закончена, остальные заблокированы.
  const busy = step.exclusive
    ? step.groups.findIndex((group, g) => {
        const done = progress[g] ?? []
        return group.type === 'sequence' && done.some(Boolean) && !done.every(Boolean)
      })
    : -1

  step.groups.forEach((group, g) => {
    const done = next[g]
    if (!done || (busy !== -1 && g !== busy)) return

    if (group.type === 'sequence') {
      const i = done.indexOf(false) // только следующее по порядку.
      const action = group.actions[i]
      if (i !== -1 && matches(action)) {
        done[i] = true
        matched.push(action!)
      }
      return
    }

    group.actions.forEach((action, j) => {
      if (!done[j] && matches(action)) {
        done[j] = true
        matched.push(action)
      }
    })
  })

  return matched.length ? { progress: next, matched } : null
}

export const showStepToasts = (step: (typeof steps)[number]): void => {
  const addToast = useToastStore.getState().addToast
  useToastStore.getState().clear()
 
  step.groups.forEach(group =>
    group.actions.forEach(action => {
      const toast = action.meta.toast
      if (toast) addToast({ message: toast })
    })
  )
}
