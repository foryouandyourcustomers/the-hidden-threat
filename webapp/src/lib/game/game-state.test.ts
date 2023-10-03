import { GameState } from '$lib/game/game-state'
import type { GameEvent, PlayerGameEvent, SharedGameContext, User } from '$lib/game/types'
import { createDefaultAttacker, createDefaultDefender } from '$lib/server/game/utils'
import type { DistributiveOmit } from '$lib/utils'
import { describe, it, expect, beforeEach } from 'vitest'

describe('game state', () => {
  let host: User
  let context: SharedGameContext

  const completeEvent = <T extends PlayerGameEvent>(
    event: DistributiveOmit<T, 'timestamp' | 'finalized' | 'userId'>,
  ): T =>
    ({
      ...event,
      timestamp: 0,
      userId: host.id,
      finalized: true,
    } as unknown as T)

  const getPlacementEvents = () => [
    completeEvent({
      type: 'placement',
      playerId: 'defender0',
      coordinate: [0, 0],
    }),
    completeEvent({
      type: 'placement',
      playerId: 'defender1',
      coordinate: [0, 0],
    }),
    completeEvent({
      type: 'placement',
      playerId: 'defender2',
      coordinate: [0, 0],
    }),
    completeEvent({
      type: 'placement',
      playerId: 'defender3',
      coordinate: [0, 0],
    }),
    completeEvent({
      type: 'placement',
      playerId: 'attacker',
      coordinate: [0, 0],
    }),
  ]

  const getRoundEvents = () => [
    completeEvent({ type: 'move', playerId: 'attacker', to: [0, 0] }),
    completeEvent({
      type: 'action',
      action: 'collect',
      playerId: 'attacker',
      position: [0, 0],
      itemId: 'gun',
    }),
    completeEvent({ type: 'move', playerId: 'defender0', to: [0, 0] }),
    completeEvent({
      type: 'action',
      action: 'collect',
      playerId: 'defender0',
      position: [0, 0],
      itemId: 'certificate',
    }),
    completeEvent({ type: 'move', playerId: 'defender1', to: [0, 0] }),
    completeEvent({
      type: 'action',
      action: 'collect',
      playerId: 'defender1',
      position: [0, 0],
      itemId: 'certificate',
    }),
    completeEvent({ type: 'move', playerId: 'attacker', to: [0, 0] }),
    completeEvent({
      type: 'action',
      action: 'collect',
      playerId: 'attacker',
      position: [0, 0],
      itemId: 'gun',
    }),
    completeEvent({ type: 'move', playerId: 'defender2', to: [0, 0] }),
    completeEvent({
      type: 'action',
      action: 'collect',
      playerId: 'defender2',
      position: [0, 0],
      itemId: 'certificate',
    }),
    completeEvent({ type: 'move', playerId: 'defender3', to: [0, 0] }),
    completeEvent({
      type: 'action',
      action: 'collect',
      playerId: 'defender3',
      position: [0, 0],
      itemId: 'certificate',
    }),
  ]

  beforeEach(() => {
    host = {
      id: 'hostUserId',
      name: 'name',
      isAdmin: true,
      isConnected: true,
      side: 'defense',
      isSideAssigned: true,
    }

    context = {
      timestamp: 0,
      gameId: 'gameId',
      hostUserId: host.id,
      finishedAssigningSides: false,
      globalAttackScenario: 0,
      targetedAttacks: Array.from({ length: 12 }, (_, i) => i),
      defense: {
        finishedAssigning: false,
        defenders: [
          createDefaultDefender(host.id, 'defender0'),
          createDefaultDefender(host.id, 'defender1'),
          createDefaultDefender(host.id, 'defender2'),
          createDefaultDefender(host.id, 'defender3'),
        ],
      },
      attack: {
        finishedAssigning: false,
        attacker: createDefaultAttacker(host.id),
      },
      users: [host],
      events: [],
    }
  })

  it('returns predictable random numbers', () => {
    const gameState = GameState.fromContext(context)
    const randomNumber = gameState.getRandomNumber(0)
    expect(randomNumber).toBe(gameState.getRandomNumber(0))
    expect(gameState.getRandomNumber(99)).toBe(gameState.getRandomNumber(99))
    expect(randomNumber).toBe(gameState.getRandomNumber(0))
  })

  it('exececutes no global attack before second section', () => {
    const gameState = GameState.fromContext({
      ...context,
      events: [
        ...getPlacementEvents(),
        ...getRoundEvents(),
        ...getRoundEvents(),
        ...getRoundEvents().slice(0, -1),
      ],
    })
    expect(gameState.attackedStages).toHaveLength(0)
  })

  it('exececutes a global attack if it is not prevented', () => {
    const gameState = GameState.fromContext({
      ...context,
      events: [
        ...getPlacementEvents(),
        ...getRoundEvents(),
        ...getRoundEvents(),
        ...getRoundEvents(),
      ],
    })
    expect(gameState.attackedStages).toHaveLength(2)
    const sortedAttackedStageIds = gameState.attackedStages.map((stage) => stage.id)
    sortedAttackedStageIds.sort()
    const sortedSzenarioTargetStageIds = gameState.globalAttackScenario.attacks[0].targets.map(
      (target) => target.stageId,
    )
    sortedAttackedStageIds.sort()
    expect(sortedAttackedStageIds).toEqual(sortedSzenarioTargetStageIds)
  })

  it('exececutes a global attack if it is not prevented', () => {
    const gameState = GameState.fromContext({
      ...context,
      events: [
        ...getPlacementEvents(),
        ...getRoundEvents(),
        ...getRoundEvents(),
        ...getRoundEvents(), // global attack
        ...getRoundEvents(),
        ...getRoundEvents(),
        ...getRoundEvents(), // global attack
      ],
    })
    expect(gameState.attackedStages).toHaveLength(4)
  })
})
