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
] as const satisfies readonly Stage[]
