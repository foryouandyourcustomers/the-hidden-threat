import type { DefenseItemId } from './items'

type Stage = {
  id: string
  name: string
  description: string
  defenseItems: readonly DefenseItemId[]
}

export type StageId = (typeof STAGES)[number]['id']

export const STAGES = [
  {
    id: 'supply',
    name: 'Beschaffung',
    description: '',
    defenseItems: ['alarm-system', 'extinguisher', 'gps-tracker'],
  },
  {
    id: 'production',
    name: 'Produktion',
    description: '',
    defenseItems: ['alarm-system', 'extinguisher', 'gps-tracker'],
  },
  {
    id: 'datacenter',
    name: 'Rechenzentrum',
    description: '',
    defenseItems: ['alarm-system', 'extinguisher', 'gps-tracker'],
  },
  {
    id: 'storage',
    name: 'Lagerung',
    description: '',
    defenseItems: ['alarm-system', 'extinguisher', 'gps-tracker'],
  },
  {
    id: 'logistics',
    name: 'Logistik',
    description: '',
    defenseItems: ['alarm-system', 'extinguisher', 'gps-tracker'],
  },
  {
    id: 'sales',
    name: 'Handel',
    description: '',
    defenseItems: ['alarm-system', 'extinguisher', 'gps-tracker'],
  },
] as const satisfies readonly Stage[]
