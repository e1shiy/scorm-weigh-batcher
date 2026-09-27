import type { SchemeObject } from './types'

export const objects = [] satisfies SchemeObject[]

export type AnyObject = (typeof objects)[number]
export type ObjectId = AnyObject['id']