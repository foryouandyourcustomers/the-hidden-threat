import type { ClientEvent } from '$lib/client/game-machine/types'
import type { DistributiveOmit } from '$lib/utils'
import type { AttackCharacterId, DefenseCharacterId } from './constants/characters'
import type { FaceId } from './constants/faces'
import type { AttackItemId, DefenseItemId } from './constants/items'

export type Side = 'defense' | 'attack'

/**
 * All messages that the server might send to the clients via WebSockets.
 */
export type ServerMessage =
  | {
      type: 'shared game context update'
      sharedGameContext: SharedGameContext
    }
  | {
      type: 'show emoji'
      emoji: string
      userId: string
    }
  | {
      type: 'mouse position'
      userId: string
      position: [number, number]
    }

type UserPrefixed<T extends ClientEvent> = {
  [K in keyof T]: K extends 'type' ? `user: ${T[K]}` : T[K]
}
export type ClientEventAsMessage = UserPrefixed<ClientEvent>

/**
 * All messages that the clients might send to the server via WebSockets.
 */
export type ClientMessage =
  | ClientEventAsMessage
  /** This is not forwarded to the machine but redirected directly to the other
   * users */
  | {
      type: `mouse position`
      position: [number, number]
    }

/**
 * The base user type that is used by the server and client.
 *
 * A user is an actual person sitting in front of a browser and connecting to
 * the game.
 *
 * They might be an observer, a host/admin or controlling a `Character`.
 */
export type User = {
  id: string
  name: string
  isAdmin: boolean
  isConnected: boolean
  /**
   * Users don't really have a side since they are controlling "Characters"
   * which have a side.
   *
   * But they can be assigned to a side, since it defines what they can see.
   *
   * It doesn't make sense for a user to control a character that is on the
   * opposite side, but a user that is a spectator is simply assigned at side
   * at the start of the game.
   */
  side: Side
  /** Wether an admin has explicitly assigned a side.  */
  isSideAssigned: boolean
}

/**
 * The base class for Defender and Attacker.
 */
type BasePlayer = {
  userId: string
  faceId: FaceId
  /**
   * If false the player still has default values.
   * True, after an admin configured the player.
   */
  isConfigured: boolean
}

export type Defender = BasePlayer & {
  id: DefenderId
  character: DefenseCharacterId
}
export type Attacker = BasePlayer & {
  id: AttackerId
  character: AttackCharacterId
}

export type Player = Defender | Attacker

export type Coordinate = [number, number]

export type PlayerId = DefenderId | AttackerId
export type DefenderId = 'defender0' | 'defender1' | 'defender2' | 'defender3'
export type AttackerId = 'attacker'

export const isDefenderId = (id: PlayerId): id is DefenderId => id !== 'attacker'
export const isAttackerId = (id: PlayerId): id is AttackerId => id === 'attacker'

export const isPlayerIdOfSide = <T extends Side>(
  playerId: PlayerId,
  side: T,
): playerId is T extends 'attack' ? AttackerId : DefenderId =>
  side === 'attack' ? isAttackerId(playerId) : isDefenderId(playerId)

type BaseGameEvent = {
  timestamp: number
  playerId: PlayerId
  /** Which user actually triggered the event. */
  userId: string
  finalized: boolean
}

export type GameEvent =
  | (BaseGameEvent & {
      type: 'move'
      to: Coordinate
    })
  | (BaseGameEvent & {
      type: 'placement'
      coordinate: Coordinate
    })
  | (BaseGameEvent & {
      type: 'action'
      action: 'collect'
      /** Can be undefined if the event is not finalized. */
      itemId?: AttackItemId | DefenseItemId | undefined
      position: Coordinate
    })

/**
 * The same as `GameEvent` but without the information that the server will set
 * instead.
 *
 * The client should not be allowed to send a userId or timestamp since these
 * are values that the server completes and the client cannot change.
 */
export type FromClientGameEvent = DistributiveOmit<GameEvent, 'userId' | 'timestamp'>

export type GameEventOf<Type extends GameEvent['type']> = Extract<GameEvent, { type: Type }>
export type ActionEvent = GameEventOf<'action'>
type GameEventAction = GameEventOf<'action'>['action']
export type ActionEventOf<Action extends GameEventAction> = Extract<
  GameEvent,
  { type: 'action'; action: Action }
>

/** Type guard to check whether the provided event is of type `type` */
export const isGameEventOf = <Type extends GameEvent['type']>(
  event: GameEvent | undefined,
  type: Type,
): event is GameEventOf<Type> => event?.type === type

export const isActionEventOf = <Action extends GameEventAction>(
  event: GameEvent | undefined,
  action: Action,
): event is ActionEventOf<Action> => event?.type === 'action' && event.action === action

/**
 * A helper function to create a type guard for a specific `GameEvent` type.
 *
 * Typical usage:
 *
 *     const isMoveEvent = guardForGameEventType('move')
 *     const moveEvents = events.filter(isMoveEvent)
 *
 * The advantage of this, is that TypeScript can infer the type of moveEvents
 */
export const guardForGameEventType =
  <Type extends GameEvent['type']>(type: Type) =>
  (event: GameEvent): event is GameEventOf<Type> =>
    isGameEventOf(event, type)

/**
 * A helper function to create a type guard for a specific `GameEvent` for
 * a specific action.
 *
 * Typical usage:
 *
 *     const isCollectAction = guardForGameEventAction('collect')
 *     const collectEvents = events.filter(isCollectAction)
 *
 * The advantage of this, is that TypeScript can infer the type of moveEvents
 */
export const guardForGameEventAction =
  <Action extends GameEventAction>(action: Action) =>
  (event: GameEvent): event is ActionEventOf<Action> =>
    isActionEventOf(event, action)

export type AttackScenario = 'todo'

export type BoardItem = {
  id: DefenseItemId | AttackItemId
  position: Coordinate
}

export type SharedGameContext = {
  gameId: string
  hostUserId: string
  users: User[]
  events: GameEvent[]
  finishedAssigningSides: boolean
  globalAttackScenarios: [AttackScenario, AttackScenario, AttackScenario, AttackScenario]
  defense: {
    editingPlayerId?: undefined | DefenderId
    finishedAssigning: boolean
    /** The list of defenders in the correct order. Up to 4 */
    defenders: [Defender, Defender, Defender, Defender]
  }
  attack: {
    editingPlayerId?: undefined | AttackerId
    finishedAssigning: boolean
    attacker: Attacker
  }
}
