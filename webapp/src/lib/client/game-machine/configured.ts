import { GameState } from '$lib/game/game-state'
import { sharedGuards } from '$lib/game/guards'
import type { ClientEventAsMessage, ClientMessage } from '$lib/game/types'
import { and, assign, not } from 'xstate'
import { machine } from './machine'
import type { Actions, ClientEvent, ClientEventOf } from './types'
import { getCurrentUser } from './utils'
import { userIsAdmin } from '$lib/game/utils'

export const getClientGameMachine = ({
  send,
  actions,
}: {
  send: (message: ClientMessage) => void
  actions: Actions
}) =>
  machine.provide({
    actions: {
      updateSharedGameContext: assign(({ event: e }) => {
        const event = e as ClientEventOf<'shared game context update'>
        return {
          ...event.sharedGameContext,
        }
      }),
      showEmoji: ({ event: e }) => {
        const event = e as ClientEventOf<'show emoji'>
        actions.showEmoji({ userId: event.userId, emoji: event.emoji })
      },
      forwardToServer: ({ event: e }) => {
        const event = e as ClientEvent
        send({ ...event, type: `user: ${event.type}` } as ClientEventAsMessage)
      },
    },
    actors: {},
    guards: {
      isHost: ({ context }) => context.hostUserId === context.userId,
      isAdmin: ({ context }) =>
        !!context.users.find((user) => user.id === context.userId && user.isAdmin),
      isPlayer: ({ context }) => context.hostUserId !== context.userId,

      allRolesAssignedOfSide: ({ context }) => {
        const { side } = getCurrentUser(context)
        if (!side) return false

        if (side === 'attack') {
          return !!context.attack.attacker
        } else {
          return context.defense.defenders.length === 4
        }
      },
      finishedAssigningRolesOfSide: ({ context }) => {
        const { side } = getCurrentUser(context)
        if (!side) return false
        return (side === 'attack' ? context.attack : context.defense).finishedAssigning
      },
      isEditingPlayerOfSide: ({ context }) => {
        const { side } = getCurrentUser(context)
        if (!side) return false
        const editingPlayer = (side === 'attack' ? context.attack : context.defense).editingPlayerId
        return editingPlayer !== undefined
      },
      isNotEditingPlayerOfSide: not('isEditingPlayerOfSide'),
      userControlsPlayer: ({ context }) => {
        const user = getCurrentUser(context)
        return user.isAdmin || user.id === GameState.fromContext(context).activePlayer.userId
      },
      isMoveEvent: ({ event: e }) => {
        const event = e as ClientEventOf<'apply game event'>
        return event.gameEvent.type === 'move'
      },
      isActionEvent: ({ event: e }) => {
        const event = e as ClientEventOf<'apply game event'>
        return event.gameEvent.type === 'action'
      },
      isPlacementEvent: ({ event: e }) => {
        const event = e as ClientEventOf<'apply game event'>
        return event.gameEvent.type === 'placement'
      },
      lastEventIsAction: ({ context }) => {
        const gameState = GameState.fromContext(context)
        return !!gameState.lastEvent && gameState.lastEvent.type === 'action'
      },
      lastEventNotFinalized: ({ context }) => {
        const gameState = GameState.fromContext(context)
        return !!gameState.lastEvent && !gameState.lastEvent.finalized
      },
      isValidGameEvent: ({ context }) => {
        return userIsAdmin(context.userId, context)
      },
      'userControlsPlayer isMoveEvent': and(['userControlsPlayer', 'isMoveEvent']),
      'userControlsPlayer isActionEvent': and(['userControlsPlayer', 'isActionEvent']),
      'userControlsPlayer lastEventIsAction lastEventNotFinalized': and([
        'userControlsPlayer',
        'lastEventIsAction',
        'lastEventNotFinalized',
      ]),
      'userControlsPlayer isPlacementEvent': and(['userControlsPlayer', 'isPlacementEvent']),
      userOnActiveSide: ({ context }) =>
        getCurrentUser(context).side === GameState.fromContext(context).activeSide,
      userNotOnActiveSide: not('userOnActiveSide'),
      requiresPlacement: ({ context }) =>
        GameState.fromContext(context).nextEventType === 'placement',
      requiresAction: ({ context }) => GameState.fromContext(context).nextEventType === 'action',
      requiresMove: ({ context }) => GameState.fromContext(context).nextEventType === 'move',
      userIsDefender: () => false,
      isServerStopped: () => false,

      ...sharedGuards,
    },
  })
