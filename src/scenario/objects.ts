// Реестр объектов схемы. Заполняется после проработки типов и алгоритма:
// export interface Objects { 'water-supply-valve': ValveObject /* ... */ }

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type Objects = {}

export type ObjectId = keyof Objects

export type ObjectOf<Id extends ObjectId> = Objects[Id]

export type StatusOf<Id extends ObjectId> = Objects[Id]['status']

export type ValueOf<Id extends ObjectId> = Objects[Id]['value']