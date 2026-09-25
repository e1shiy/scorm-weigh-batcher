import type { SchemeObjectBase } from './types'

export const objects = [] satisfies SchemeObjectBase[]

export type AnyObject = (typeof objects)[number]
export type ObjectId = AnyObject['id']