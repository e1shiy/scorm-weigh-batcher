import type { Action, ObjectState, SchemeObject, Step } from './types'

// Возвращает новый прогресс и засчитанные действия, либо null, если действие неверное.
export const applyChange = (step: Step, progress: boolean[][], change: SchemeObject) => {
  const matches = (action: Action | undefined) =>
    !!action && action.objectId === change.id && action.check(change.status, change.value)

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

// Состояние объектов после всех шагов до upTo (не включая его), считается с нуля.
export const replayObjects = (steps: Step[], upTo: number, initial: ObjectState): ObjectState => {
  const state: ObjectState = { ...initial }
  for (const step of steps.slice(0, upTo))
    for (const group of step.groups)
      for (const action of group.actions) {
        const prev = state[action.objectId]
        if (prev) state[action.objectId] = action.effect(prev)
      }
  return state
}