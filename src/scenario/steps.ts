import { defineAction, feederGroupActions, pumpStartGroup, setpoint, start, toAuto, valveGroup } from './action'
import { mixers } from './objects'
import type { ButtonId } from './objects'
import type { Step } from './types'

const one = (id: string, title: string, action: Step['groups'][number]['actions'][number]): Step => ({
  id,
  title,
  groups: [{ type: 'sequence', actions: [action] }],
})

export const steps: Step[] = [
  {
    id: 'start-1',
    title: 'Визуальный осмотр',
    groups: [
      {
        type: 'sequence',
        actions: [
          defineAction(
            'inspection' satisfies ButtonId,
            {
              title: 'Осмотр оборудования',
              toast:
                'Проверка фланцевых соединений, наличие защитных ограждений на конвейере, расположение ленты на конвейере и дозаторе, заземление в норме',
            },
            (_s, v) => v.checked,
            prev => ({ ...prev, value: { checked: true } }),
          ),
        ],
      },
    ],
  },
  {
    id: 'start-2',
    title: 'Запуск мешалок 3121',
    groups: [{ type: 'all', actions: mixers.map(id => start(id, `Запуск мешалки ${id}`, 'Мешалка в работе')) }],
  },
  {
    id: 'start-3',
    title: 'Запуск циркуляторов 3122',
    groups: [
      {
        type: 'all',
        actions: (['3122/A', '3122/B', '3122/B1', '3122/C'] as const).map(id =>
          start(id, `Запуск циркулятора ${id}`, 'Циркулятор в работе'),
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
        actions: (['3122/B', '3122/B1'] as const).map(id => setpoint(id, `Нагрузка циркулятора ${id}`, 100)),
      },
    ],
  },
  one('start-5', 'Запуск вентилятора 3166A', start('3166A', 'Запуск вентилятора 3166A', 'Вентилятор в работе')),
  {
    id: 'start-6',
    title: 'Запуск конвейеров 3119 и 1119/V',
    groups: [
      {
        type: 'all',
        actions: (['3119', '1119/V'] as const).map(id => start(id, `Запуск конвейера ${id}`, 'Конвейер в работе')),
      },
    ],
  },
  one('start-7', 'Запуск конвейера 1119/B', start('1119/B', 'Запуск конвейера 1119/B', 'Конвейер в работе')),

  // насосы 3129: каждое действие отдельным шагом
  one('start-8', 'Запуск насоса 3129/1', start('3129/1', 'Запуск насоса 3129/1', 'Насос в работе')),
  one('start-9', 'Задание параметра насоса 3129/1', setpoint('3129/1', 'Задание насоса 3129/1', 45, 55)),
  one('start-10', 'Перевод насоса 3129/1 в автоматический режим', toAuto('3129/1', 'Перевод насоса 3129/1 в автоматический режим')),
  one('start-11', 'Запуск насоса 3129/2', start('3129/2', 'Запуск насоса 3129/2', 'Насос в работе')),
  one('start-12', 'Задание параметра насоса 3129/2', setpoint('3129/2', 'Задание насоса 3129/2', 45, 55)),
  one('start-13', 'Перевод насоса 3129/2 в автоматический режим', toAuto('3129/2', 'Перевод насоса 3129/2 в автоматический режим')),

  {
    id: 'start-14',
    title: 'Запуск насосов 5145',
    exclusive: true,
    groups: [
      pumpStartGroup('5145/1', 'насоса 5145/1', 60, 70),
      pumpStartGroup('5145/2', 'насоса 5145/2', 60, 70),
      pumpStartGroup('5145/3', 'насоса 5145/3', 45, 55),
    ],
  },
  {
    id: 'start-15',
    title: 'Запуск дозатора 3117/1',
    groups: [{ type: 'all', actions: feederGroupActions('3117/1', '3117/1', 5) }],
  },
  {
    id: 'start-16',
    title: 'Запуск дозатора 3117/2',
    groups: [{ type: 'all', actions: feederGroupActions('3117/2', '3117/2', 60) }],
  },
  {
    id: 'start-17',
    title: 'Открытие клапанов по серной кислоте (точки 1 и 2)',
    groups: [valveGroup('2FIC 310', 'клапана 2FIC 310', 20, 23), valveGroup('2FIC 311', 'клапана 2FIC 311', 35, 37)],
  },
  one('start-18', 'Нагрузка циркулятора 3122/A на 100%', setpoint('3122/A', 'Нагрузка циркулятора 3122/A', 100)),
  {
    id: 'start-19',
    title: 'Запуск дозаторов 1118/3 и 1118/4',
    groups: [
      {
        type: 'all',
        actions: [...feederGroupActions('1118/3', '1118/3', 30), ...feederGroupActions('1118/4', '1118/4', 35)],
      },
    ],
  },
  {
    id: 'start-20',
    title: 'Открытие клапанов по серной кислоте (точки 3 и 4)',
    groups: [valveGroup('2FIC 308', 'клапана 2FIC 308', 20), valveGroup('2FIC 307', 'клапана 2FIC 307', 36)],
  },
  one('start-21', 'Нагрузка циркулятора 3122/C на 100%', setpoint('3122/C', 'Нагрузка циркулятора 3122/C', 100)),
]