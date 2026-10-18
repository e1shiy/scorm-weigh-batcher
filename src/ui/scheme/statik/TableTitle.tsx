import { SchemeBlock } from './table'
import type { BlockPosition } from './table'

const Apatitelabels = [
  { text: '1секция', x: 36.5, y: 2.5 },
  { text: 'Апатит', x: 89.4, y: 3.5 },
  { text: '2секция', x: 138.8, y: 2.4 },
  { text: 'Серная кислота', x: 70.9, y: 45.4 },
  { text: 'Реактор разложения', x: 7.1, y: 88.5 },
  { text: 'Прод. ЭФК', x: 134.8, y: 88.5 },
  { text: 'Реактор дозревения', x: 8, y: 132.5 },
  { text: 'Реакторы', x: 137.3, y: 132.5 },
] as const

export function Apatite(position: BlockPosition) {
  return <SchemeBlock {...position} height={177} labels={Apatitelabels} />
}
 
const KVF3labels = [
  { text: 'Пульпа', x: 37, y: 17.5 },
  { text: 'Фильтрат 1-й пром.', x: 118, y: 16.5 },
  { text: 'Прод. ЭФК', x: 134.8, y: 60.5 },
  { text: 'Вода', x: 20.8, y: 78.5 },
  { text: 'Разрежение', x: 55.2, y: 78.5 },
] as const
 
export function Kvf3(position: BlockPosition) {
  return <SchemeBlock {...position} title='КВФ 3' height={139} labels={KVF3labels} />
}

const KVF4labels = [
  { text: 'Пульпа', x: 37, y: 16.5 },
  { text: 'Фильтрат 1-й пром.', x: 118, y: 16.5 },
  { text: 'Вода', x: 20.8, y: 60.5 },
  { text: 'Разрежение', x: 55.2, y: 60.5 },
  { text: 'Прод. ЭФК', x: 135.3, y: 60.5 },
] as const
 
export function Kvf4(position: BlockPosition) {
  return <SchemeBlock {...position} title='КВФ 4' height={105} labels={KVF4labels} />
}


const LVFlabels = [
  { text: 'Пульпа', x: 37, y: 16.5 },
  { text: 'Фильтрат 1-й пром.', x: 118, y: 16.5 },
  { text: 'Прод. ЭФК', x: 135.8, y: 60.5 },
  { text: 'Вода', x: 20.8, y: 80.5 },
  { text: 'Разрежение', x: 55.2, y: 80.5 },
] as const
 
export function Lvf(position: BlockPosition) {
  return <SchemeBlock {...position} title='ЛВФ' height={141} labels={LVFlabels} />
}