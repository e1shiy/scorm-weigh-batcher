import type { SchemeObject, SchemeStatus } from './types'

// Значения объектов, которые UI передаёт в setObject({ id, kind, status, value }):
// - агрегаты (мешалки, циркуляторы, насосы, дозаторы...): running — пуск/стоп, setpoint — уставка/нагрузка, %
// - клапаны (2FIC): только setpoint (уставка расхода)
// - кнопки: checked — действие выполнено
export type DeviceValue = { running: boolean; setpoint: number }
export type ValveValue = { setpoint: number }
export type ButtonValue = { checked: boolean }

//create нужен для того, чтобы TS выводил тип значения по id объекта. Например, 
// у мешалки есть v.running и v.setpoint, а у клапана — только v.setpoint.
//это нужно для приведения к одному типу и избегания дублирования кода.
const create = <Id extends string, K extends string, V>(
  id: Id,
  kind: K,
  value: V,
  status: SchemeStatus = 'manual',
) => ({ id, kind, status, value })

// Агрегат (мешалка, циркулятор, насос, дозатор, вентилятор, конвейер).
// Начальное состояние: остановлен (running: false), уставка 0.
// Приведение «as DeviceValue» нужно, чтобы поле running имело тип boolean, а не литерал false.
const device = <Id extends string, K extends string>(id: Id, kind: K) =>
  create(id, kind, { running: false, setpoint: 0 })

// Клапан 2FIC: у него нет пуска/стопа, только уставка (изначально 0 — клапан закрыт).
const valve = <Id extends string>(id: Id) => 
  create(id, 'valve', { setpoint: 0 })

// Кнопка-действие (здесь — «Осмотр оборудования»). checked: false — осмотр ещё не выполнен.
const button = <Id extends string>(id: Id) => 
  create(id, 'button', { checked: false })

// ───────── список объектов схемы ─────────
// Id записаны латиницей так, как в колонке «Кнопка» таблицы.
// Если в вашем UI у объектов другие id, их нужно заменить здесь и в steps.ts.
export const objects = [
  button('inspection'), // «Осмотр оборудования»
 
  // мешалки
  device('3121/A', 'mixer'),
  device('3121/B', 'mixer'),
  device('3121/C', 'mixer'),
  device('3121/D', 'mixer'),
  device('3121/E', 'mixer'),
  device('3121/K', 'mixer'),
  device('3121/L', 'mixer'),
  device('3121/M', 'mixer'),
  device('3121/N', 'mixer'),
  device('3121/O', 'mixer'),
 
  // циркуляторы (setpoint = нагрузка 30 / 100 %)
  device('3122/A', 'circulator'),
  device('3122/B', 'circulator'),
  device('3122/B1', 'circulator'),
  device('3122/C', 'circulator'),
 
  // вентилятор
  device('3166A', 'fan'),
 
  // конвейеры
  device('3119', 'conveyor'),
  device('1119/V', 'conveyor'),
  device('1119/B', 'conveyor'),
 
  // насосы
  device('3129/1', 'pump'),
  device('3129/2', 'pump'),
  device('5145/1', 'pump'),
  device('5145/2', 'pump'),
  device('5145/3', 'pump'),
 
  // дозаторы
  device('3117/1', 'feeder'),
  device('3117/2', 'feeder'),
  device('1118/3', 'feeder'),
  device('1118/4', 'feeder'),
 
  // клапаны по серной кислоте
  valve('2FIC 310'),
  valve('2FIC 311'),
  valve('2FIC 308'),
  valve('2FIC 307'),
] satisfies SchemeObject[] // проверяем, что каждый элемент соответствует SchemeObject, не теряя точных типов
 
// Десять мешалок узла. «as const satisfies» — фиксирует точные id и проверяет, что все они агрегаты.
export const mixers = ['3121/A', '3121/B', '3121/C', '3121/D', '3121/E', '3121/K', '3121/L', '3121/M', '3121/N', '3121/O'] as const satisfies readonly DeviceId[]


// ───────── типы, выводимые из списка ─────────
// Тип любого объекта из списка (объединение всех элементов массива).
export type AnyObject = (typeof objects)[number]
// Объединение всех допустимых id: '3121/A' | '3121/B' | ... | '2FIC 307'.
// Благодаря ему defineAction не примет несуществующий id.
export type ObjectId = AnyObject['id']
 
// id объектов по типу значения (чтобы функции в steps.ts принимали только подходящие объекты,
// например start() — только агрегаты, а valveSetpoint() — только клапаны).
export type IdOf<V> = Extract<AnyObject, { value: V }>['id']
export type DeviceId = IdOf<DeviceValue> // мешалки, циркуляторы, насосы, дозаторы, вентилятор, конвейеры
export type ValveId = IdOf<ValveValue> // клапаны 2FIC
export type ButtonId = IdOf<ButtonValue> // кнопка осмотра