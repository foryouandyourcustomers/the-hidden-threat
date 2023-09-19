import type { GlobalAttack } from '../constants/global-attacks'
import { STAGES, type StageId } from '../constants/stages'
import type { TargetedAttack } from '../constants/targeted-attacks'

export * from './user'
export * from './player'

export const isTargetedAttack = (attack: TargetedAttack | GlobalAttack): attack is TargetedAttack =>
  Object.hasOwn(attack, 'target')

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const getStage = (stageId: StageId) => STAGES.find((stage) => stage.id === stageId)!
