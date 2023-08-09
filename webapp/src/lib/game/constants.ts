import type { BoardItem, Side } from './types'

export type Item = {
  id: string
  name: string
  description: string
  side: Side
}

export const ITEMS = [
  { id: 'certificate', name: 'Certificate', description: '', side: 'defense' },
  { id: 'insurance', name: 'Insurance', description: '', side: 'defense' },
  { id: 'camera', name: 'Camera', description: '', side: 'defense' },
  { id: 'alarm', name: 'Alarm', description: '', side: 'defense' },
  { id: 'lock', name: 'Lock', description: '', side: 'defense' },
  { id: 'location', name: 'Location', description: '', side: 'defense' },
  { id: 'license', name: 'License', description: '', side: 'defense' },
  { id: 'data', name: 'Data', description: '', side: 'defense' },
  { id: 'extinguisher', name: 'Extinguisher', description: '', side: 'defense' },
  { id: 'firewall', name: 'Firewall', description: '', side: 'defense' },
  { id: 'identity-card', name: 'Identity Card', description: '', side: 'attack' },
  { id: 'usb-stick', name: 'USB Stick', description: '', side: 'attack' },
  { id: 'blueprint', name: 'Blueprint', description: '', side: 'attack' },
  { id: 'cloud', name: 'Cloud', description: '', side: 'attack' },
  { id: 'virus', name: 'Virus', description: '', side: 'attack' },
  { id: 'tools', name: 'Tools', description: '', side: 'attack' },
  { id: 'gun', name: 'Gun', description: '', side: 'attack' },
  { id: 'binoculars', name: 'Binoculars', description: '', side: 'attack' },
  { id: 'dynamite', name: 'Dynamite', description: '', side: 'attack' },
  { id: 'server', name: 'Server', description: '', side: 'attack' },
] as const satisfies readonly Item[]

type ItemOfSide<T extends Item, S extends Side> = T extends { side: S } ? T : never

export type DefenseItemId = ItemOfSide<(typeof ITEMS)[number], 'defense'>['id']

export type AttackItemId = ItemOfSide<(typeof ITEMS)[number], 'attack'>['id']

export const DEFAULT_DEFENSE_INVENTORY: { [key in DefenseItemId]: number } = {
  certificate: 0,
  insurance: 0,
  camera: 0,
  alarm: 0,
  lock: 0,
  location: 0,
  license: 0,
  data: 0,
  extinguisher: 0,
  firewall: 0,
}
export const DEFAULT_ATTACK_INVENTORY: { [key in AttackItemId]: number } = {
  gun: 0,
  virus: 0,
  'identity-card': 0,
  'usb-stick': 0,
  blueprint: 0,
  cloud: 0,
  tools: 0,
  binoculars: 0,
  dynamite: 0,
  server: 0,
}

type Face = {
  id: number
}

export const FACES = [
  { id: 0 },
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8 },
] as const satisfies readonly Face[]

export type FaceId = (typeof FACES)[number]['id']

export const INITIAL_BOARD_ITEMS: BoardItem[] = [
  // Row 1
  { item: 'certificate', position: [1, 0], collectedCount: 0 },
  { item: 'usb-stick', position: [1, 0], collectedCount: 0 },
  { item: 'virus', position: [3, 0], collectedCount: 0 },
  { item: 'binoculars', position: [3, 0], collectedCount: 0 },
  { item: 'lock', position: [4, 0], collectedCount: 0 },
  { item: 'server', position: [4, 0], collectedCount: 0 },
  { item: 'location', position: [5, 0], collectedCount: 0 },
  { item: 'identity-card', position: [5, 0], collectedCount: 0 },
  { item: 'data', position: [6, 0], collectedCount: 0 },
  { item: 'dynamite', position: [6, 0], collectedCount: 0 },
  { item: 'license', position: [7, 0], collectedCount: 0 },
  { item: 'tools', position: [7, 0], collectedCount: 0 },
  { item: 'camera', position: [8, 0], collectedCount: 0 },
  { item: 'cloud', position: [8, 0], collectedCount: 0 },
  // Row 2
  { item: 'camera', position: [0, 1], collectedCount: 0 },
  { item: 'identity-card', position: [0, 1], collectedCount: 0 },
  { item: 'alarm', position: [1, 1], collectedCount: 0 },
  { item: 'server', position: [1, 1], collectedCount: 0 },
  { item: 'gun', position: [2, 1], collectedCount: 0 },
  { item: 'blueprint', position: [2, 1], collectedCount: 0 },
  { item: 'extinguisher', position: [3, 1], collectedCount: 0 },
  { item: 'cloud', position: [3, 1], collectedCount: 0 },
  { item: 'certificate', position: [4, 1], collectedCount: 0 },
  { item: 'tools', position: [4, 1], collectedCount: 0 },
  { item: 'usb-stick', position: [6, 1], collectedCount: 0 },
  { item: 'blueprint', position: [6, 1], collectedCount: 0 },
  { item: 'lock', position: [8, 1], collectedCount: 0 },
  { item: 'virus', position: [8, 1], collectedCount: 0 },
]
