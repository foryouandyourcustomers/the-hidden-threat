import { findStageAt } from '$lib/game/constants/board-stages'
import {
  isDefenseCharacter,
  type AttackCharacterId,
  type DefenseCharacterId,
} from '$lib/game/constants/characters'
import { isAttackItemId, isDefenseItemId, isItemIdOfSide } from '$lib/game/constants/items'
import { GameState } from '$lib/game/game-state'
import { sharedGuards } from '$lib/game/guards'
import {
  isAttackerId,
  isDefenderId,
  isPlayerGameEvent,
  type DefenderId,
  type GameEvent,
  type SharedGameContext,
} from '$lib/game/types'
import {
  findUserIndex,
  getCharacter,
  getPlayerSide,
  userControlsPlayer,
  userControlsPlayerId,
  userIsAdmin,
} from '$lib/game/utils'
import { sendMessageToUsers } from '$lib/server/web-socket/game-communication'
import { produce, setAutoFreeze } from 'immer'
import isEqual from 'lodash/isEqual'
import { assign, fromPromise } from 'xstate'
import { machine } from './machine'
import type { ServerEventOf } from './types'
import { sendSummaryEmail } from '$lib/server/mail/mail'

setAutoFreeze(false)

export const serverGameMachine = machine.provide({
  actions: {
    setAssigningSidesFinished: assign(() => ({ finishedAssigningSides: true })),
    setAdminsForPlayers: assign(({ context }) => {
      const attackAdmin = context.users.find((user) => user.isAdmin && user.side === 'attack')
      const defenseAdmin = context.users.find((user) => user.isAdmin && user.side === 'defense')
      if (!attackAdmin || !defenseAdmin) return {}

      return {
        attack: produce(context.attack, (attack) => {
          attack.attacker.userId = attackAdmin.id
        }),
        defense: produce(context.defense, (defense) => {
          defense.defenders.forEach((defender) => {
            defender.userId = defenseAdmin.id
          })
        }),
      }
    }),
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
          const lastPlayerEvent = events.filter(isPlayerGameEvent).pop()
          if (lastPlayerEvent && !lastPlayerEvent.finalized) {
            events[events.indexOf(lastPlayerEvent)] = gameEvent
          } else {
            events.push(gameEvent)
          }
        }),
      }
    }),
    cancelGameEvent: assign(({ context }) => {
      return {
        events: produce(context.events, (events) => {
          const lastPlayerEvent = events.filter(isPlayerGameEvent).pop()
          if (lastPlayerEvent && !lastPlayerEvent.finalized) {
            events.splice(context.events.indexOf(lastPlayerEvent), 1)
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
    switchSides: assign(({ context, event: e }) => {
      const event = e as ServerEventOf<'user: switch sides'>
      const userId = event.userId
      return {
        users: produce(context.users, (users) => {
          const user = users.find((user) => user.id === userId)
          if (user) {
            user.side = user?.side === 'attack' ? 'defense' : 'attack'
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
          const user = users[userIndex]
          user.side = event.side
          // An admin can't unassign themselves from being an admin.
          user.isAdmin = event.userId === user.id ? true : event.isAdmin
          user.isSideAssigned = true
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

      /** All admin events are allowed if the user is an admin. */
      if (event.gameEvent.type === 'system') {
        return userIsAdmin(event.userId, context)
      }

      const activePlayer = gameState.activePlayer
      if (!userControlsPlayer(event.userId, activePlayer, context)) return false

      // Make sure it's this player's turn
      if (activePlayer.id !== event.gameEvent.playerId) return false

      // Make sure the event type is the next expected event type
      if (gameState.nextEventType !== event.gameEvent.type) return false

      const character = getCharacter(gameState.activePlayer.character)

      // Make event type specific checks
      switch (event.gameEvent.type) {
        case 'placement':
          // TODO: implement role specific check
          break
        case 'move':
          if (!gameState.isValidMove(event.gameEvent.to)) return false
          break
        case 'reaction':
          if (event.gameEvent.finalized && event.gameEvent.useJoker === undefined) return false
          // TODO: check that there was an action that needs a reaction
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
            case 'attack': {
              if (!isAttackerId(activePlayer.id)) return false
              const position = event.gameEvent.position

              if (!position && event.gameEvent.finalized) {
                return false
              } else if (!position) {
                if (gameState.attackableStages.length === 0) return false
              } else if (
                !gameState.attackableStages.find((stage) => isEqual(stage.coordinate, position))
              ) {
                return false
              }

              break
            }
            case 'defend': {
              if (!isDefenderId(activePlayer.id)) return false
              const position = event.gameEvent.position
              if (!isEqual(position, gameState.activePlayerPosition)) return false

              if (!gameState.canDefendStage) return false

              break
            }
            case 'exchange-joker': {
              const itemId = event.gameEvent.itemId
              if (!isAttackerId(activePlayer.id)) return false
              if (gameState.jokers <= 0) return false
              if (!itemId && event.gameEvent.finalized) return false
              if (itemId && !isAttackItemId(itemId)) return false
              break
            }
            case 'ask-question': {
              const question = event.gameEvent.question
              if (!isDefenderId(activePlayer.id)) return false
              if (!question && event.gameEvent.finalized) return false
              if (question === 'has-collected-items' && !!findStageAt(event.gameEvent.position))
                return false
              break
            }

            // Special abilities
            // =================

            case 'exchange-digital-footprint': {
              if (!isDefenseCharacter(character)) return false
              if (character.ability !== 'exchange-digital-footprint') return false
              const itemId = event.gameEvent.item
              if (!itemId && event.gameEvent.finalized) return false
              if (itemId && (!isDefenseItemId(itemId) || itemId === 'digital-footprint'))
                return false
              if (gameState.defenseInventory['digital-footprint'] <= 0) return false
              break
            }
            case 'is-attacking-stage': {
              if (!isDefenseCharacter(character)) return false
              if (character.ability !== 'is-attacking-stage') return false
              if (event.gameEvent.position) {
                if (!findStageAt(event.gameEvent.position)) return false
                if (!isEqual(event.gameEvent.position, gameState.activePlayerPosition)) return false
              }
              if (!event.gameEvent.position && event.gameEvent.finalized) return false
              break
            }
            case 'is-next-to-attacker': {
              if (!isDefenseCharacter(character)) return false
              if (character.ability !== 'is-next-to-attacker') return false
              if (!event.gameEvent.position && event.gameEvent.finalized) return false
              if (event.gameEvent.position) {
                if (!isEqual(event.gameEvent.position, gameState.activePlayerPosition)) return false
              }
              break
            }
            case 'quarter-reveal': {
              if (!isDefenseCharacter(character)) return false
              if (character.ability !== 'quarter-reveal') return false
              break
            }
          }
          break
      }

      return true
    },
    ...sharedGuards,
  },
  actors: {
    sendSummary: fromPromise(async (context: { input: { sharedContext: SharedGameContext } }) => {
      await sendSummaryEmail(JSON.stringify(context.input.sharedContext))
    }),
  },
})
