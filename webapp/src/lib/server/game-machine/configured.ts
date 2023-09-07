import type { AttackCharacterId, DefenseCharacterId } from '$lib/game/constants/characters'
import { isItemIdOfSide } from '$lib/game/constants/items'
import { GameState } from '$lib/game/game-state'
import { sharedGuards } from '$lib/game/guards'
import {
  isDefenderId,
  type DefenderId,
  type GameEvent,
  type SharedGameContext,
} from '$lib/game/types'
import {
  findUserIndex,
  getPlayerSide,
  userControlsPlayer,
  userControlsPlayerId,
} from '$lib/game/utils'
import { sendMessageToUsers } from '$lib/server/web-socket/game-communication'
import { produce, setAutoFreeze } from 'immer'
import { assign, fromPromise } from 'xstate'
import { machine } from './machine'
import type { ServerEventOf } from './types'

setAutoFreeze(false)

export const serverGameMachine = machine.provide({
  actions: {
    sendSummary: () => {
      // todo
    },
    setAssigningSidesFinished: assign(() => ({ finishedAssigningSides: true })),
    setAssigningRolesFinished: assign(({ context, event: e }) => {
      const { userId } = e as ServerEventOf<'user: next step'>
      const side = context.users.find((user) => user.id === userId)?.side

      if (side === 'attack') {
        return {
          attack: {
            ...context.attack,
            finishedAssigning: true,
          } satisfies SharedGameContext['attack'],
        }
      } else if (side === 'defense') {
        return {
          defense: {
            ...context.defense,
            finishedAssigning: true,
          } satisfies SharedGameContext['defense'],
        }
      } else {
        return {}
      }
    }),
    setEditingPlayer: assign(({ context, event: e }) => {
      const event = e as ServerEventOf<'user: start editing player' | 'user: stop editing player'>

      const side =
        event.type === 'user: stop editing player' ? event.side : getPlayerSide(event.playerId)

      if (side === 'attack') {
        return {
          attack: {
            ...context.attack,
            editingPlayerId: event.type === 'user: start editing player' ? 'attacker' : undefined,
          } satisfies SharedGameContext['attack'],
        }
      } else if (side === 'defense') {
        return {
          defense: {
            ...context.defense,
            editingPlayerId:
              event.type === 'user: stop editing player'
                ? undefined
                : (event.playerId as DefenderId),
          } satisfies SharedGameContext['defense'],
        }
      } else {
        return {}
      }
    }),
    addOrUpdateGameEvent: assign(({ context, event: e }) => {
      const event = e as ServerEventOf<'user: apply game event'>

      // The validity of the event has already been checked by a guard
      const gameEvent: GameEvent = {
        ...event.gameEvent,
        timestamp: Date.now(),
        userId: event.userId,
      }

      return {
        events: produce(context.events, (events) => {
          const lastEvent = events[events.length - 1]
          if (lastEvent && !lastEvent.finalized) {
            events[events.length - 1] = gameEvent
          } else {
            events.push(gameEvent)
          }
        }),
      }
    }),
    cancelGameEvent: assign(({ context }) => {
      return {
        events: produce(context.events, (events) => {
          const lastEvent = events[events.length - 1]
          if (lastEvent && !lastEvent.finalized) {
            events.pop()
          }
        }),
      }
    }),
    rollbackGameEvent: assign(({ context, event: e }) => {
      const event = e as ServerEventOf<'user: rollback game event'>
      return {
        events: produce(context.events, (events) => {
          if (events[events.length - 1].type === event.gameEventType) {
            events.pop()
          }
        }),
      }
    }),
    updatePlayer: assign(({ context, event: e }) => {
      const event = e as ServerEventOf<'user: assign role'>

      const playerId = event.playerId

      if (isDefenderId(playerId)) {
        return {
          defense: produce(context.defense, (defense) => {
            const player = defense.defenders.find((player) => player.id === playerId)
            if (!player) throw new Error(`Player ${playerId} not found in context`)
            player.faceId = event.faceId
            player.character = event.character as DefenseCharacterId
            player.userId = event.playingUserId
            player.isConfigured = true
          }),
        }
      } else {
        return {
          attack: produce(context.attack, (attack) => {
            attack.attacker.faceId = event.faceId
            attack.attacker.character = event.character as AttackCharacterId
            attack.attacker.userId = event.playingUserId
            attack.attacker.isConfigured = true
          }),
        }
      }

      // todo
    }),

    updateUserConnectionState: assign(({ context, event: e }) => {
      const event = e as ServerEventOf<'user connected' | 'user reconnected' | 'user disconnected'>

      const existingUserIndex = context.users.findIndex((user) => user.id === event.userId)
      if (existingUserIndex !== -1) {
        return {
          users: produce(context.users, (users) => {
            users[existingUserIndex].isConnected =
              event.type === 'user connected' || event.type === 'user reconnected'
          }),
        }
      } else {
        console.warn('Got a connection update for a user that has not joined', event.userId)
        return {}
      }
    }),
    storeNewUser: assign(({ context, event: e }) => {
      const event = e as ServerEventOf<'user joined'>

      const existingUser = context.users.find((user) => user.id === event.userId)
      if (!existingUser) {
        return {
          users: [
            ...context.users,
            {
              id: event.userId,
              name: event.userName,
              isAdmin: false,
              isConnected: false,
              side: 'defense',
              isSideAssigned: false,
            },
          ],
        }
      } else {
        console.warn('User already joined', event.userId)
        return {}
      }
    }),
    // sendUsersUpdate: ({ context }) => {
    //   sendMessageToUsers({
    //     gameId: context.gameId,
    //     message: {
    //       type: 'shared game context update',
    //       users: [...context.users],
    //     },
    //   })
    // },
    sendEmojiToOtherUsers: ({ context, event: e }) => {
      const event = e as ServerEventOf<'user: send emoji'>
      sendMessageToUsers({
        gameId: context.gameId,
        message: {
          type: 'show emoji',
          emoji: event.emoji,
          userId: event.userId,
        },
        excludeUserIds: [event.userId],
      })
    },
    assignSide: assign(({ context, event: e }) => {
      const event = e as ServerEventOf<'user: assign side'>

      const userIndex = findUserIndex(event.otherUserId, context)
      if (userIndex === undefined) return {}

      return {
        users: produce(context.users, (users) => {
          users[userIndex].side = event.side
          users[userIndex].isSideAssigned = true
        }),
      }
    }),
    assignAdmin: assign(({ context, event: e }) => {
      const event = e as ServerEventOf<'user: assign admin'>

      const userIndex = findUserIndex(event.otherUserId, context)
      if (userIndex === undefined) return {}

      return {
        users: produce(context.users, (users) => {
          users[userIndex].isAdmin = event.isAdmin
        }),
      }
    }),
  },
  guards: {
    isAdmin: ({ context, event }) =>
      context.users.find((user) => user.id === event.userId)?.isAdmin ?? false,
    isAllowedToCancel: ({ context, event: e }) => {
      const event = e as ServerEventOf<'user: cancel game event'>

      const gameState = GameState.fromContext(context)

      return (
        !!gameState.lastEvent &&
        !gameState.lastEvent.finalized &&
        userControlsPlayerId(event.userId, gameState.lastEvent.playerId, context)
      )
    },
    isValidGameEvent: ({ context, event: e }) => {
      const event = e as ServerEventOf<'user: apply game event'>
      const gameState = GameState.fromContext(context)

      // TODO: this needs to verify that the given game event is valid in the current context.

      const activePlayer = gameState.activePlayer
      if (!userControlsPlayer(event.userId, activePlayer, context)) return false

      // Make sure it's this player's turn
      if (activePlayer.id !== event.gameEvent.playerId) return false

      // Make sure the event type is the next expected event type
      if (gameState.nextEventType !== event.gameEvent.type) return false

      // Make event type specific checks
      switch (event.gameEvent.type) {
        case 'placement':
          // TODO: implement role specific check
          break
        case 'move':
          if (!gameState.isValidMove(event.gameEvent.to)) return false
          break
        case 'action':
          switch (event.gameEvent.action) {
            case 'collect':
              if (event.gameEvent.itemId === undefined && event.gameEvent.finalized) {
                console.error('Finalized collect item must have an itemId')
                return false
              }

              if (event.gameEvent.itemId) {
                const collectableItemIds = gameState
                  .getItemsForCoordinate(gameState.activePlayerPosition)
                  .filter((item) => isItemIdOfSide(item.item.id, gameState.activeSide))
                  .map((item) => item.item.id)

                if (!collectableItemIds.includes(event.gameEvent.itemId)) {
                  console.error('Tried to collect an item that is not collectable')
                  return false
                }
              }
              break
          }
          break
      }

      return true

      // gameState.playerMoved -> 'collect'
      // collect.finalized = false

      // This means that this guard needs to check:
      // - that the user has the right to perform the event
      // - the event happens at the right time
      // - if the previous event is not finalized, that this is a change to the
      //   the previous event
      // ...?

      return true
    },
    ...sharedGuards,
  },
  actors: {
    loadParticipants: fromPromise(async () => {
      // This is just a placeholder for any actual actors we might need in the
      // future.
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return ['a', 'b']
    }),
  },
})
