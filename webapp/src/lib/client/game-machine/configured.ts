import type { ClientEventAsMessage, ClientMessage } from '$lib/game/types'
import { assign, not } from 'xstate'
import { machine } from './machine'
import type { Actions, ClientEvent, ClientEventOf } from './types'
import { sharedGuards } from '$lib/game/guards'
import { getUser } from './utils'

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
        const { side } = getUser(context)
        if (!side) return false

        if (side === 'attack') {
          return !!context.attack.attacker
        } else {
          return context.defense.defenders.length === 4
        }
      },
      finishedAssigningRolesOfSide: ({ context }) => {
        const { side } = getUser(context)
        if (!side) return false
        return (side === 'attack' ? context.attack : context.defense).finishedAssigning
      },
      isEditingPlayerOfSide: ({ context }) => {
        const { side } = getUser(context)
        if (!side) return false
        const editingPlayer = (side === 'attack' ? context.attack : context.defense).editingPlayer
        return editingPlayer !== undefined
      },
      isNotEditingPlayerOfSide: not('isEditingPlayerOfSide'),
      userControlsPlayer: () => false,
      userOnActiveSide: () => false,
      userNotOnActiveSide: () => false,
      playerMoved: () => false,
      userIsDefender: () => false,
      isServerStopped: () => false,
      playerPerformedAction: () => false,

      ...sharedGuards,
    },
  })
