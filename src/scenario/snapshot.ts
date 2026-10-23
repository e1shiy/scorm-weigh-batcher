import type { Action, ObjectsState, SchemeStatus, Step } from './types'

type Entry = { status: SchemeStatus; value: unknown }

// Действия, выполненные к моменту перескока: все шаги до stepIndex
// и первые doneInStep действий самого шага (по группам подряд).
export const completedActions = (steps: Step[], stepIndex: number, doneInStep = 0): Action[] => [
  ...steps.slice(0, stepIndex).flatMap(step => step.groups.flatMap(group => group.actions)),
  ...(steps[stepIndex]?.groups.flatMap(group => group.actions).slice(0, doneInStep) ?? []),
]

export const buildStateAtStep = (
  steps: Step[],
  initial: ObjectsState,
  stepIndex: number,
  doneInStep = 0,
): ObjectsState => {
  const state: Record<string, Entry> = { ...initial }

  for (const action of completedActions(steps, stepIndex, doneInStep)) {
    const current = state[action.objectId]
    if (!current || !action.target) continue

    const target = action.target(current)
    const value = action.effect ? action.effect(target.value) : target.value
    state[action.objectId] = { status: target.status, value }
  }

  return state as ObjectsState
}