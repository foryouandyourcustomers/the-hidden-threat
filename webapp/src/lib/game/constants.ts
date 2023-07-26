// TODO: add real items
export const DEFAULT_DEFENSE_INVENTORY = {
  cloud: 0,
  shield: 0,
}
export const DEFAULT_ATTACK_INVENTORY = {
  gun: 0,
  virus: 0,
}

// TODO: add real faces
export const FACES = {
  man: 'man',
  woman: 'woman',
  other: 'other',
} as const

export type FaceId = keyof typeof FACES
