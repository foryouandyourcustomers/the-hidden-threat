type Stage = {
  id: string
  name: string
  description: string
}

export type StageId = (typeof STAGES)[number]['id']

export const STAGES = [
  {
    id: 'supply',
    name: 'Beschaffung',
    description: '',
  },
  {
    id: 'production',
    name: 'Produktion',
    description: '',
  },
  {
    id: 'datacenter',
    name: 'Rechenzentrum',
    description: '',
  },
  {
    id: 'storage',
    name: 'Lagerung',
    description: '',
  },
  {
    id: 'logistics',
    name: 'Logistik',
    description: '',
  },
  {
    id: 'sales',
    name: 'Handel',
    description: '',
  },
] as const satisfies readonly Stage[]
