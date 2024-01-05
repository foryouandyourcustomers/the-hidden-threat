import { throwIfNotFound } from '$lib/utils'
import type { DefenseItemId } from './items'

export type StageId = 'supply' | 'production' | 'datacenter' | 'storage' | 'logistics' | 'sales'

export type Stage = {
  id: StageId
  name: string
  description: string
  gender: 'm' | 'f' | 'n'
  defenseItems: readonly DefenseItemId[]
}

export const getStage = (stageId: StageId): Stage =>
  STAGES.find((stage) => stage.id === stageId) ?? throwIfNotFound()

export const STAGES: readonly Stage[] = [
  {
    id: 'supply',
    name: 'Beschaffung',
    description: '',
    gender: 'f',
    defenseItems: ['insurance', 'license', 'extinguisher'],
  },
  {
    id: 'production',
    name: 'Produktion',
    description: '',
    gender: 'f',
    defenseItems: ['security-camera', 'alarm-system', 'lock'],
  },
  {
    id: 'datacenter',
    name: 'Rechenzentrum',
    description: '',
    gender: 'n',
    defenseItems: ['encrypted-data', 'firewall', 'digital-footprint'],
  },
  {
    id: 'storage',
    name: 'Lagerung',
    description: '',
    gender: 'f',
    defenseItems: ['security-camera', 'alarm-system', 'extinguisher'],
  },
  {
    id: 'logistics',
    name: 'Logistik',
    description: '',
    gender: 'f',
    defenseItems: ['insurance', 'digital-footprint', 'gps-tracker'],
  },
  {
    id: 'sales',
    name: 'Handel',
    description: '',
    gender: 'm',
    defenseItems: ['certificate', 'insurance', 'lock'],
  },
] as const
