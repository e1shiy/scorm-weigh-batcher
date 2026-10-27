import type { ObjectId } from './objects'
import type { Action, ObjectChange, Step } from './types'

// exclusive: пока sequence-группа начата, но не закончена, остальные заблокированы.
// Возвращает индекс такой группы или -1.
const findBusy = (step: Step, progress: boolean[][]) =>
  step.exclusive
    ? step.groups.findIndex((group, g) => {
        const done = progress[g] ?? []
        return group.type === 'sequence' && done.some(Boolean) && !done.every(Boolean)
      })
    : -1

// Возвращает новый прогресс и засчитанные действия, либо null, если действие неверное.
export const applyChange = <Id extends ObjectId>(step: Step, progress: boolean[][], change: ObjectChange<Id>) => {
  const matches = (action: Action | undefined) =>
    !!action && action.objectId === change.id && action.check(change.status, change.value)

  const next = progress.map(done => [...done])
  const matched: Action[] = []

  const busy = findBusy(step, progress)

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

// Ручная отметка подпункта из админ-панели (j-е действие g-й группы).
// Возвращает новый прогресс или null, если отметить или снять это действие сейчас нельзя.
export const toggleAction = (step: Step, progress: boolean[][], g: number, j: number): boolean[][] | null => {
  const group = step.groups[g]
  const done = progress[g]
  if (!group || !done || j < 0 || j >= done.length) return null

  // exclusive: пока начата одна sequence-группа, трогать можно только её.
  const busy = findBusy(step, progress)
  if (busy !== -1 && busy !== g) return null

  // sequence: отметить можно только следующее по порядку, снять только последнее выполненное.
  if (group.type === 'sequence') {
    const allowed = done[j] ? j === done.lastIndexOf(true) : j === done.indexOf(false)
    if (!allowed) return null
  }

  return progress.map((d, i) => (i === g ? d.map((value, k) => (k === j ? !value : value)) : [...d]))
}