import { create } from 'zustand'
import type { CompletionStatus, SCORM_API, SuccessStatus } from './types'
import { getAPI } from './getApi'
import { useProcedureStore } from '../procedure/useProcedureStore'

type ScormState = {
  api: SCORM_API | null

  isInitialized: boolean
  isTerminated: boolean
  completionStatus: CompletionStatus
  successStatus: SuccessStatus
  scaledPassingScore: number
  scoreRaw: number
  scoreMin: number
  scoreMax: number

  initialize: () => void
  finish: () => void
  commit: () => void

  setCompletionStatus: (status: CompletionStatus) => void
  setSuccessStatus: (status: SuccessStatus) => void
  applyScoreDelta: (delta: number) => void
}

export const useScormStore = create<ScormState>((set, get) => ({
  api: null,
  isInitialized: false,
  isTerminated: false,
  completionStatus: 'incomplete',
  successStatus: 'unknown',
  scaledPassingScore: 0,
  scoreRaw: 100,
  scoreMin: 0,
  scoreMax: 100,
  initialize: () => {
    if (get().isInitialized) return
    const api = getAPI(window)
    const result = api.Initialize('')
    if (result === 'false') throw new Error("Couldn't initialize SCORM API")

    const { scoreMin, scoreMax, completionStatus } = get()

    const passingScore = api.GetValue('cmi.scaled_passing_score')
    if (!passingScore) console.warn("Couldn't get scaled_passing_score value, set to 0")
    const scaledPassingScore = passingScore ? parseFloat(passingScore) : 0

    api.SetValue('cmi.score.raw', scoreMin.toString())
    api.SetValue('cmi.score.min', scoreMin.toString())
    api.SetValue('cmi.score.max', scoreMax.toString())
    api.SetValue('cmi.completion_status', completionStatus)

    set({ api, isInitialized: true, scaledPassingScore: scaledPassingScore })
  },
  finish: () => {
    const { api, isTerminated, scaledPassingScore, scoreRaw, scoreMax } = get()

    if (isTerminated || !api) return
    set({ isTerminated: true })

    const { currentStepIndex, totalSteps } = useProcedureStore.getState()
    const isCompleted = currentStepIndex === totalSteps

    const completionStatus: CompletionStatus = isCompleted ? 'completed' : 'incomplete'
    let successStatus: SuccessStatus = 'unknown'
    if (isCompleted) successStatus = scoreRaw / scoreMax >= scaledPassingScore ? 'passed' : 'failed'

    api.SetValue('cmi.completion_status', completionStatus)
    api.SetValue('cmi.success_status', successStatus)
    api.SetValue('cmi.score.raw', scoreRaw.toString())
    api.SetValue('cmi.score.scaled', (scoreRaw / scoreMax).toString())

    api.Commit('')
    api.Terminate('')

    set({ completionStatus: completionStatus, successStatus: successStatus })
  },
  commit: () => {
    const { api } = get()
    if (!api) throw new Error("Couldn't commit: no api")

    api.Commit('')
  },
  setCompletionStatus: status => {
    const { api } = get()
    if (!api) throw new Error("Couldn't set completionStatus: no api")

    api.SetValue('cmi.completion_status', status)
    set({ completionStatus: status })
  },
  setSuccessStatus: status => {
    const { api } = get()
    if (!api) throw new Error("Couldn't set successStatus: no api")

    api.SetValue('cmi.success_status', status)
    set({ successStatus: status })
  },
  applyScoreDelta: delta => {
    const { api, scoreRaw, scoreMax, scoreMin } = get()
    if (!api) {
      throw new Error("Couldn't set score: no api")
    }

    set({ scoreRaw: Math.min(Math.max(scoreRaw + delta, scoreMin), scoreMax) })
  }
}))
