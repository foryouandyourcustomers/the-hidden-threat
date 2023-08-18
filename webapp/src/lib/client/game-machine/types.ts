import type { CharacterId, FaceId } from '$lib/game/constants'
import type { GameEvent, PlayerId, ServerMessage, SharedGameContext, Side } from '$lib/game/types'
import type { Sound } from '$lib/sound'

export type Context = SharedGameContext & {
  userId: string
}

/** A utility type that allows us to Omit keys of a union type */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never

/**
 * All the events that can be sent to the client machine, excluding the ones
 * that come from the server.
 *
 * It's important, that none of these events have a `userId` since this will
 * be overridden on the server.
 */
export type NativeClientEvent =
  | {
      type: 'assign side'
      otherUserId: string
      side: Side
    }
  | {
      type: 'assign admin'
      otherUserId: string
      isAdmin: boolean
    }
  | { type: 'admin starts game' }
  | { type: 'next step' }
  | { type: 'start editing player'; playerId: PlayerId }
  | { type: 'stop editing player'; side: Side }
  | {
      type: 'assign role'
      playerId: PlayerId
      faceId: FaceId
      character: CharacterId
      /** Not using `userId` since client events cannot use userId because it'll
       * be overwritten by the server */
      playingUserId: string
    }
  | { type: 'send emoji'; emoji: string }
  | { type: 'apply game event'; gameEvent: DistributiveOmit<GameEvent, 'userId' | 'timestamp'> }
  | { type: 'rollback game event'; gameEventType: GameEvent['type'] }
  | { type: 'switch sides' }
  | { type: 'dismiss global attack' }
  | { type: 'new global attack' }
  | { type: 'show global attack' }

export type ClientEvent =
  // All messages that the server sends can be used as client events
  ServerMessage | NativeClientEvent

export type ClientEventOf<Type extends ClientEvent['type']> = Extract<ClientEvent, { type: Type }>

export type Actions = {
  playSound: (sound: Sound) => void
  showEmoji: (args: { emoji: string; userId: string }) => void
}
