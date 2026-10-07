export type CompletionStatus = 'completed' | 'incomplete' | 'not attempted' | 'unknown'
export type SuccessStatus = 'passed' | 'failed' | 'unknown'
type ScaledPassingScore = string // -1...1
type ScoreRaw = string
type ScoreMin = string
type ScoreMax = string
type ScoreScaled = string // -1...1

type CMIElementMap = {
  'cmi.completion_status': CompletionStatus
  'cmi.success_status': SuccessStatus
  'cmi.scaled_passing_score': ScaledPassingScore
  'cmi.score.raw': ScoreRaw
  'cmi.score.min': ScoreMin
  'cmi.score.max': ScoreMax
  'cmi.score.scaled': ScoreScaled 
}

export type SCORM_API = {
  Initialize: (value: '') => 'true' | 'false'
  Terminate: (value: '') => 'true' | 'false'
  Commit: (value: '') => 'true' | 'false'
  GetValue: <K extends keyof CMIElementMap>(element: K) => string
  SetValue: <K extends keyof CMIElementMap>(element: K, value: CMIElementMap[K]) => 'true' | 'false'
}

export type WindowSCORM = Window & {
  API_1484_11?: SCORM_API
}
