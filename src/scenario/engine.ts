import type{ SchemeObject, Step, Action} from './types'
// ───────── проверка действия по текущему шагу ─────────

// Применяет изменение к текущему шагу.
// Возвращает новый прогресс и выполненные действия, либо null, если действие неверное.
// Сам прогресс НЕ мутируется: работаем с копией (next), чтобы стор получил новый объект.
export const applyChange = (step: Step, progress: boolean[][], change: SchemeObject) => {
  // Подходит ли действие под изменение: тот же объект И состояние проходит check действия.
  const matches = (action: Action | undefined) =>
    !!action && action.objectId === change.id && action.check(change.status, change.value)

  const next = progress.map(done => [...done]) // копия прогресса
  const matched: Action[] = [] // какие действия это изменение засчитало (для истории)

  // Режим exclusive (насосы 5145): если какая-то sequence-группа уже начата, но не закончена,
  // то принимаются только действия этой группы. Индекс такой группы — busy (или −1, если её нет).
  // Считаем по ИСХОДНОМУ progress, т.е. по состоянию до этого действия.
  const busy = step.exclusive
    ? step.groups.findIndex((group, g) => {
        const done = progress[g] ?? []
        return group.type === 'sequence' && done.some(Boolean) && !done.every(Boolean)
      })
    : -1

  step.groups.forEach((group, g) => {
    const done = next[g]
    if (!done) return
    if (busy !== -1 && g !== busy) return // чужие группы заблокированы, пока busy не завершена

    if (group.type === 'sequence') {
      // только следующее по порядку действие
      // indexOf(false) — первое невыполненное; если все выполнены, вернёт −1.
      const i = done.indexOf(false)
      const action = group.actions[i]
      if (i !== -1 && action && matches(action)) {
        done[i] = true
        matched.push(action)
      }
      return
    }

    // all: любое ещё не выполненное действие (одно изменение может закрыть несколько)
    // Пример: у дозатора изменение { running: true, setpoint: 5 } закрывает и «пуск», и «уставку».
    group.actions.forEach((action, j) => {
      if (!done[j] && matches(action)) {
        done[j] = true
        matched.push(action)
      }
    })
  })

  // Если ни одно действие не засчитано — изменение неверное (null).
  return matched.length ? { progress: next, matched } : null
}