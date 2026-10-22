import { defineAction, feederGroupActions, pumpStartGroup, setpoint, start, toAuto, valveGroup } from './action'
import { mixers } from './objects'
import type { ButtonId } from './objects'
import type { Step } from './types'

const createStep = (id: string, title: string, action: Step['groups'][number]['actions'][number]): Step => ({
  id,
  title,
  groups: [{ type: 'sequence', actions: [action] }],
})
//
export const steps: Step[] = [
  {
    id: 'start-1',
    title: 'Визуальный осмотр',
    groups: [
      {
        type: 'sequence',
        actions: [
          defineAction(
            'Визуальный осмотр' satisfies ButtonId,
            {
              title: 'Визуальный осмотр',
              toast:
                'Проверка фланцевых соединений, наличие защитных ограждений на конвейере, расположение ленты на конвейере и дозаторе, заземление в норме',
            },
            (_s, v) => v.checked,
            undefined,
            ({ status }) => ({ status, value: { checked: true } }),
          ),
        ],
      },
    ],
  },
  {
    id: 'start-2',
    title: 'Запуск мешалок 3121',
    groups: [
      {
        type: 'all',
        actions: mixers.map(id => start(id, { title: id, description: 'Пуск', toast: 'Мешалка в работе' })),
      },
    ],
  },
  {
    id: 'start-3',
    title: 'Запуск циркуляторов 3122',
    groups: [
      {
        type: 'all',
        actions: (['3122/A', '3122/B', '3122/B1', '3122/C'] as const).map(id =>
          start(id, { title: id, description: 'Пуск', toast: 'Циркулятор в работе' }),
        ),
      },
    ],
  },
  {
    id: 'start-4',
    title: 'Нагрузка циркуляторов 3122/B и 3122/B1 на 100%',
    groups: [
      {
        type: 'all',
        actions: (['3122/B', '3122/B1'] as const).map(id =>
          setpoint(id, { title: id, description: 'Задание уставки' }, 100),
        ),
      },
    ],
  },
  createStep(
    'start-5',
    'Запуск вентилятора 3166A',
    start('3166A', { title: '3166A', description: 'Пуск', toast: 'Вентилятор в работе' }),
  ),
  {
    id: 'start-6',
    title: 'Запуск конвейеров 3119 и 1119/V',
    groups: [
      {
        type: 'all',
        actions: (['3119', '1119/V'] as const).map(id =>
          start(id, { title: id, description: 'Пуск', toast: 'Конвейер в работе' }),
        ),
      },
    ],
  },
  createStep(
    'start-7',
    'Запуск конвейера 1119/B',
    start('1119/B', { title: '1119/B', description: 'Пуск', toast: 'Конвейер в работе' }),
  ),

  // насосы 3129: каждое действие отдельным шагом
  createStep(
    'start-8',
    'Запуск насоса 3129/1',
    start('3129/1', { title: '3129/1', description: 'Пуск', toast: 'Насос в работе' }),
  ),
  createStep(
    'start-9',
    'Задание параметра насоса 3129/1',
    setpoint('3129/1', { title: '3129/1', description: 'Задание уставки' }, 45, 55),
  ),
  createStep(
    'start-10',
    'Перевод насоса 3129/1 в автоматический режим',
    toAuto('3129/1', { title: '3129/1', description: 'Перевод в автоматический режим' }),
  ),
  createStep(
    'start-11',
    'Запуск насоса 3129/2',
    start('3129/2', { title: '3129/2', description: 'Пуск', toast: 'Насос в работе' }),
  ),
  createStep(
    'start-12',
    'Задание параметра насоса 3129/2',
    setpoint('3129/2', { title: '3129/2', description: 'Задание уставки' }, 45, 55),
  ),
  createStep(
    'start-13',
    'Перевод насоса 3129/2 в автоматический режим',
    toAuto('3129/2', { title: '3129/2', description: 'Перевод в автоматический режим' }),
  ),

  {
    id: 'start-14',
    title: 'Запуск насосов 5145',
    exclusive: true,
    groups: [
      pumpStartGroup('5145/1', 60, 70),
      pumpStartGroup('5145/2', 60, 70),
      pumpStartGroup('5145/3', 45, 55),
    ],
  },
  {
    id: 'start-15',
    title: 'Запуск дозатора 3117/1',
    groups: [{ type: 'all', actions: feederGroupActions('3117/1', 5) }],
  },
  {
    id: 'start-16',
    title: 'Запуск дозатора 3117/2',
    groups: [{ type: 'all', actions: feederGroupActions('3117/2', 60) }],
  },
  {
    id: 'start-17',
    title: 'Открытие клапанов по серной кислоте (точки 1 и 2)',
    groups: [valveGroup('2FIC 310', 20, 23), valveGroup('2FIC 311', 35, 37)],
  },
  createStep(
    'start-18',
    'Нагрузка циркулятора 3122/A на 100%',
    setpoint('3122/A', { title: '3122/A', description: 'Задание уставки' }, 100),
  ),
  {
    id: 'start-19',
    title: 'Запуск дозаторов 1118/3 и 1118/4',
    groups: [
      {
        type: 'all',
        actions: [...feederGroupActions('1118/3', 30), ...feederGroupActions('1118/4', 35)],
      },
    ],
  },
  {
    id: 'start-20',
    title: 'Открытие клапанов по серной кислоте (точки 3 и 4)',
    groups: [valveGroup('2FIC 308', 20), valveGroup('2FIC 307', 36)],
  },
  createStep(
    'start-21',
    'Нагрузка циркулятора 3122/C на 100%',
    setpoint('3122/C', { title: '3122/C', description: 'Задание уставки' }, 100),
  ),
]