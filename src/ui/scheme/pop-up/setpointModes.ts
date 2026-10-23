import { circulators, mixers, pumps, transporters, valves, vents, type DeviceId, type ValveId } from '../../../scenario/objects.ts'

export type SetpointMode = 'none' | 'input' | 'panel'

const TRANSPORTERS_WITHOUT_SETPOINT: readonly string[] = ['3119', '1118/2']

const withMode = <Id extends string>(ids: readonly Id[], getMode: (id: Id) => SetpointMode) =>
  Object.fromEntries(ids.map(id => [id, getMode(id)])) as Record<Id, SetpointMode>

export const setpointModes: Record<DeviceId | ValveId, SetpointMode> = {
  ...withMode(mixers, () => 'none'),
  ...withMode(vents, () => 'none'),
  ...withMode(circulators, () => 'input'),
  ...withMode(pumps, () => 'panel'),
  ...withMode(valves, () => 'panel'),
  ...withMode(transporters, id => (TRANSPORTERS_WITHOUT_SETPOINT.includes(id) ? 'none' : 'panel'))
}
