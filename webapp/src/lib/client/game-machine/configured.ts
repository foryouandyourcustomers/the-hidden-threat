import type { ClientEventAsMessage, ClientMessage } from '$lib/game/types'
import { assign } from 'xstate'
import { machine } from './machine'
import type { Actions, ClientEvent, ClientEventOf } from './types'
import { sharedGuards } from '$lib/game/guards'

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
      // TODO
      // TODO
      finishedAssigningRoles: () => false,
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
