// TODO: add real items
export const DEFAULT_DEFENSE_INVENTORY = {
  cloud: 0,
  shield: 0,
}
export const DEFAULT_ATTACK_INVENTORY = {
  gun: 0,
  virus: 0,
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
