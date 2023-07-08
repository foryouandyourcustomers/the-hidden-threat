import type { ClientMessage } from '$lib/game/types'
import { assign } from 'xstate'
import { machine } from './machine'
import type { Actions, ClientEventOf } from './types'

export const getClientGameMachine = ({
  send,
  actions,
}: {
  send: (message: ClientMessage) => void
  actions: Actions
}) =>
  machine.provide({
    actions: {
      consoleLogValue: ({ event }) => {
        console.log(event)
      },
      consoleLogValueAgain: ({ context }) => {
        console.log('context value 2: ', context)
      },
      updateUsers: assign(({ event: e }) => {
        const event = e as ClientEventOf<'users update'>
        return {
          users: event.users,
        }
      }),
      sendEmoji: ({ event: e }) => {
        const event = e as ClientEventOf<'user sends emoji'>
        send({ type: 'send emoji', emoji: event.emoji })
      },
      showEmoji: ({ event: e }) => {
        const event = e as ClientEventOf<'show emoji'>
        actions.showEmoji({ userId: event.userId, emoji: event.emoji })
      },
      forwardToServer: ({ event: e }) => {
        const event = e as ClientEventOf<'assign side'>
        send(event)
      },
    },
    actors: {},
    guards: {
      isHost: ({ context }) => context.hostUserId === context.userId,
      isAdmin: ({ context }) =>
        !!context.users.find((user) => user.id === context.userId && user.isAdmin),
      isPlayer: ({ context }) => context.hostUserId !== context.userId,
      // TODO
      gameNotStarted: () => true,
      // TODO
      gameFinished: () => false,
    },
  })
