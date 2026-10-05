import type { Action, ActionMeta, SchemeStatus } from './types'
import type { AnyObject, ObjectId } from './objects'
import type { DeviceId, ValveId } from './objects'
import type { StepGroup } from './types'

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
  check: check as Action['check'],
})

// ───────── вспомогательные функции ─────────

// Попадает ли значение в диапазон [min, max]. Если max не указан — нужно ТОЧНОЕ значение min.
// Это по идее нужно, я писал с расчетом, что некоторые действи подразуевают предварительную установку значения, а потом только пуск
export const inRange = (value: number, min: number, max = min) => value >= min && value <= max
export const label = (min: number, max = min) => (min === max ? `${min}` : `${min}–${max}`)

// «Пуск»: верно, если агрегат в работе (running: true). Уставку и режим не проверяем.
export const start = (id: DeviceId, title: string, toast?: string) =>
  defineAction(id, { title, toast }, (_s, v) => v.running)

// «Стоп»: верно, если агрегат остановлен (running: false).
const stop = (id: DeviceId, title: string, toast?: string) =>
  defineAction(id, { title, toast }, (_s, v) => !v.running)

// Уставка / нагрузка агрегата: верно, если режим ручной и значение в диапазоне.
// running здесь НЕ проверяем: у дозаторов по таблице уставку можно задать до пуска.
// Для последовательных цепочек (насос) пуск и так выполнен предыдущим действием.
const setpoint = (id: DeviceId | ValveId, title: string, min: number, max = min) =>
  defineAction(id, { title: `${title}: ${label(min, max)}` }, (s, v) => s === 'manual' && inRange(v.setpoint, min, max))

// Перевод в автоматический режим: проверяется только режим, значение не важно.
const toAuto = (id: DeviceId | ValveId, title: string) =>
  defineAction(id, { title }, s => s === 'auto')

// Перевод в ручной режим (нужен при остановке: сначала в ручной, потом разгрузка).
const toManual = (id: DeviceId | ValveId, title: string) =>
  defineAction(id, { title }, s => s === 'manual')

// пуск → задание → автоматический режим (строго по порядку)
const pumpStartGroup = (id: DeviceId, name: string, min: number, max = min): StepGroup => ({
  type: 'sequence',
  actions: [
    start(id, `Запуск ${name}`, 'Насос в работе'),
    setpoint(id, `Задание ${name}`, min, max),
    toAuto(id, `Перевод ${name} в автоматический режим`),
  ],
})

// задание клапана → автоматический режим
const valveGroup = (id: ValveId, name: string, min: number, max = min): StepGroup => ({
  type: 'sequence',
  actions: [
    setpoint(id, `Задание ${name}`, min, max),
    toAuto(id, `Перевод ${name} в автоматический режим`),
  ],
})

// переход в ручной режим → разгрузка до 10 % (строго по порядку)
const pumpUnloadGroup = (id: DeviceId, name: string): StepGroup => ({
  type: 'sequence',
  actions: [
    toManual(id, `Перевод ${name} в ручной режим`),
    defineAction(id, { title: `Разгрузка ${name}: 10`, toast: 'Насос разгружен' }, (s, v) => s === 'manual' && v.setpoint === 10),
  ],
})

// Действия для одного дозатора: пуск и уставка. Возвращаются массивом и кладутся в группу 'all' —
// по таблице «можно сперва задать уставку, а потом запустить» (порядок не важен).
// Одно изменение с running: true и верной уставкой закрывает оба действия сразу (applyChange в сторе).
const feederGroupActions = (id: DeviceId, name: string, value: number) => [
  start(id, `Запуск дозатора ${name}`, 'Дозатор в работе'),
  setpoint(id, `Уставка дозатора ${name}`, value),
]

// Десять мешалок узла. «as const satisfies» — фиксирует точные id и проверяет, что все они агрегаты.
const mixers = ['3121/A', '3121/B', '3121/C', '3121/D', '3121/E', '3121/K', '3121/L', '3121/M', '3121/N', '3121/O'] as const satisfies readonly DeviceId[]
