import type { Action, ActionMeta, SchemeStatus } from './types'
import type { AnyObject } from './objects'

export const defineAction = <A extends AnyObject>(
  objectId: A['id'],
  meta: ActionMeta,
  check: (status: SchemeStatus, value: A['value']) => boolean,
): Action => ({ objectId, meta, check: check as Action['check'] })