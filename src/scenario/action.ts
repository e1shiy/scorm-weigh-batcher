import type { Action, ActionMeta, SchemeStatus } from './types'
import type { AnyObject, ObjectId } from './objects'

// defineAction создаёт Action и при этом даёт check ТОЧНУЮ типизацию значения.
// Как это работает:
//   • Id выводится TypeScript'ом из первого аргумента: defineAction('3121/A', ...) → Id = '3121/A'.
//   • Extract<AnyObject, { id: Id }> выбирает из всех объектов схемы именно тот, у которого такой id.
//   • ['value'] берёт тип его значения — например DeviceValue для мешалки.
// Поэтому в check автодополнение знает, что у мешалки есть v.running и v.setpoint,
// а у клапана — только v.setpoint. Опечатка в id или обращение к несуществующему полю
// будут подсвечены при компиляции, а не обнаружатся уже во время обучения.
//
// Параметры:
//   objectId — id объекта, к которому относится действие (только существующие в objects.ts)
//   meta     — как называть действие в истории и что показывать в уведомлении
//   check    — функция «состояние верное?» (режим, значение) → true/false
export const defineAction = <Id extends ObjectId>(
  objectId: Id,
  meta: ActionMeta,
  check: (status: SchemeStatus, value: Extract<AnyObject, { id: Id }>['value']) => boolean,
): Action => ({
  objectId,
  meta,
  // В общем типе Action значение — unknown (там лежат действия разных объектов),
  // поэтому типизированную функцию приводим к общему виду. Через unknown, потому что
  // TypeScript не может сам доказать совместимость обобщённых типов; на практике это
  // безопасно: стор вызывает check только для действия того объекта, которому оно принадлежит.
  check: check as unknown as Action['check'],
})