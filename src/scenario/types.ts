// Режим работы объекта на схеме:
//   'manual' — ручной (оператор сам задаёт уставку / нагрузку)
//   'auto'   — автоматический (регулятор держит значение сам)
export type SchemeStatus = 'manual' | 'auto'


// Именно такой объект UI передаёт в setObject() при каждом действии пользователя.
//   K — тип (kind) объекта в виде строкового литерала ('mixer', 'pump', ...)
//   V — форма поля value (у агрегатов это { running, setpoint }, у клапанов { setpoint } ...)
export interface SchemeObject<K extends string = string, V = unknown> {
  id: string
  kind: K
  status: SchemeStatus
  value: V
}

// Описание действия для пользователя: что показывать в истории и во всплывающем уведомлении.
export interface ActionMeta {
  title: string
  description?: string
  toast?: string
}

// Одно ожидаемое действие сценария: «объект X должен оказаться в состоянии, удовлетворяющем check».
export interface Action {
  objectId: string // с каким объектом должно быть действие
  meta: ActionMeta // как действие называется в истории / уведомлении
  // Проверка состояния, в которое пользователь перевёл объект. true — действие верное.
  // value здесь unknown, потому что в Action хранятся действия всех объектов сразу;
  // точная типизация делается на этапе создания в defineAction (action.ts).
  check: (status: SchemeStatus, value: unknown) => boolean
}

// all — все действия в любом порядке (например, запуск всех мешалок)
// sequence — действия строго по порядку (например, пуск → задание → авто у насоса)
export type StepGroup =
  | { type: 'all'; actions: Action[] }
  | { type: 'sequence'; actions: Action[] }

// Шаг считается выполненным, когда выполнены ВСЕ действия ВСЕХ его групп.
// Группы одного шага «параллельны»: пользователь может работать с любой из них.
export interface Step {
  id: string // технический идентификатор шага, например 'start-14'
  title: string // название шага (показывается в истории при пропуске / в подсказках)
  groups: StepGroup[]
  // true — группы типа sequence выполняются по одной: пока начатая группа не завершена,
  // начинать другую нельзя (например, «начали с одним насосом — доведи его до авто»)
  exclusive?: boolean
}

// Снимок текущего состояния всех объектов схемы: id → { режим, значение }.
// UI читает его из стора, чтобы рисовать схему.
export type ObjectState = Record<string, { status: SchemeStatus; value: unknown }>

export type HistoryEntry = {
  id: string
  meta: ActionMeta
  isSuccess: boolean
  scoreDelta: number
}