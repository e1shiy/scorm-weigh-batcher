import type { SCORM_API, WindowSCORM } from './types'

const maxTries = 500

const scanForAPI = (window: WindowSCORM): SCORM_API => {
  let tries = 0
  while (tries++ < maxTries) {
    if (window.API_1484_11) return window.API_1484_11
    if (window.parent === window) break
    window = window.parent
  }
  throw new Error("Couldn't find the API")
}

export const getAPI = (window: Window): SCORM_API => {
  if (window.parent !== window) return scanForAPI(window)
  if (window.opener) return scanForAPI(window.opener)
  throw new Error("No parent or opener found. Can't scan for API")
}
