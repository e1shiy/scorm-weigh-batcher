import type { Step } from './types'
import type { Objects } from './objects'

// Алгоритм: последовательность шагов, каждый — пул допустимых действий.
// Заполняется вместе с объектами схемы.
export const steps: Step<Objects>[] = []