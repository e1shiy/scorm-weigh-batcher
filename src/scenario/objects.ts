import type { SchemeObjectBase } from './types'

// Реестр объектов схемы — единственный источник правды.
// Заполняется после проработки типов и алгоритма, например:
// export const objects = [
//   { id: 'water-supply-valve' as const, status: 'manual', value: 0 }
// ] satisfies SchemeObjectBase[]
export const objects = [] satisfies SchemeObjectBase[]

export type AnyObject = (typeof objects)[number]
export type Objects = { [E in AnyObject as E['id']]: E }
export type ObjectId = AnyObject['id']