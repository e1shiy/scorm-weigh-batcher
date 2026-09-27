import type { Action, ActionMeta, SchemeStatus } from './types'
import type { AnyObject } from './objects'

export const defineAction = <A extends AnyObject>(
  objectId: A['id'],
  meta: ActionMeta,
  check: (status: SchemeStatus, value: A['value']) => boolean,
  isRunning = false,
): Action => ({ objectId, meta, isRunning, check: check as Action['check'] })