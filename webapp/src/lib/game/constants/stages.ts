import type { DefenseItemId } from './items'

type Stage = {
  id: string
  name: string
  description: string
  gender: 'm' | 'f' | 'n'
  defenseItems: readonly DefenseItemId[]
}

export type StageId = (typeof STAGES)[number]['id']

export const STAGES = [
  {
    id: 'supply',
    name: 'Beschaffung',
    description: '',
    gender: 'f',
    defenseItems: ['alarm-system', 'extinguisher', 'gps-tracker'],
  },
  {
    id: 'production',
    name: 'Produktion',
    description: '',
    gender: 'f',
    defenseItems: ['alarm-system', 'extinguisher', 'gps-tracker'],
  },
  {
    id: 'datacenter',
    name: 'Rechenzentrum',
    description: '',
    gender: 'n',
    defenseItems: ['alarm-system', 'extinguisher', 'gps-tracker'],
  },
  {
    id: 'storage',
    name: 'Lagerung',
    description: '',
    gender: 'f',
    defenseItems: ['alarm-system', 'extinguisher', 'gps-tracker'],
  },
  {
    id: 'logistics',
    name: 'Logistik',
    description: '',
    gender: 'f',
    defenseItems: ['alarm-system', 'extinguisher', 'gps-tracker'],
  },
  {
    id: 'sales',
    name: 'Handel',
    description: '',
    gender: 'm',
    defenseItems: ['alarm-system', 'extinguisher', 'gps-tracker'],
  },
] as const satisfies readonly Stage[]
