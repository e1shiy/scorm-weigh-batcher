import { clamp } from '../../../lib/clamp.ts'
import type { DeviceId, ValveId } from '../../../scenario/objects.ts'
import { Circulator_Data, Mixer_Data, Pump_Data, Transporter_Data, Valve_Data, Vent_Data } from '../config/dinamikData.ts'
import { SCHEMA_HEIGHT, SCHEMA_WIDTH } from '../statik/schema.tsx'

export type PopUpPosition = { x: number; y: number }
export type PopUpSize = { width: number; height: number }
export type SchemeRect = PopUpPosition & PopUpSize

const OFFSET_X = 50
const OFFSET_Y = -40

const anchors = new Map<string, PopUpPosition>(
  [...Mixer_Data, ...Circulator_Data, ...Vent_Data, ...Pump_Data, ...Transporter_Data, ...Valve_Data].map(({ id, x, y }) => [id, { x, y }])
)

const getAnchor = (id: DeviceId | ValveId) => anchors.get(id) ?? { x: SCHEMA_WIDTH / 2, y: SCHEMA_HEIGHT / 2 }

export const measurePopUp = (element: HTMLElement) => {
  const layer = element.parentElement
  const scale = layer ? layer.getBoundingClientRect().width / SCHEMA_WIDTH : 1
  const rect = element.getBoundingClientRect()
  return { scale, size: { width: rect.width / scale, height: rect.height / scale } }
}

export const clampPopUpPosition = ({ x, y }: PopUpPosition, { width, height }: PopUpSize): PopUpPosition => ({
  x: clamp(x, 0, SCHEMA_WIDTH - width),
  y: clamp(y, 0, SCHEMA_HEIGHT - height)
})

export const getInitialPopUpPosition = (id: DeviceId | ValveId, size: PopUpSize): PopUpPosition => {
  const anchor = getAnchor(id)
  const rightX = anchor.x + OFFSET_X
  const x = rightX + size.width <= SCHEMA_WIDTH ? rightX : anchor.x - size.width

  return clampPopUpPosition({ x, y: anchor.y + OFFSET_Y }, size)
}

export const getPopUpFocusRect = (id: DeviceId | ValveId, position: PopUpPosition, size: PopUpSize): SchemeRect => {
  const anchor = getAnchor(id)
  const left = Math.min(anchor.x, position.x)
  const top = Math.min(anchor.y, position.y)
  const right = Math.max(anchor.x, position.x + size.width)
  const bottom = Math.max(anchor.y, position.y + size.height)

  return { x: left, y: top, width: right - left, height: bottom - top }
}
