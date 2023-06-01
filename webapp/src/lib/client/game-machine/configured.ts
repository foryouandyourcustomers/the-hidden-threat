import { machine } from './machine'
import { assign, fromPromise } from 'xstate'
import type { Actions, ClientEventOf } from './types'
import type { ClientMessage } from '$lib/game/types'

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
      updatePlayers: assign(({ event: e }) => {
        const event = e as ClientEventOf<'players update'>
        return {
          players: event.players,
        }
      }),
      sendEmoji: ({ event: e }) => {
        const event = e as ClientEventOf<'player sends emoji'>
        send({ type: 'send emoji', emoji: event.emoji })
      },
      showEmoji: ({ event: e }) => {
        const event = e as ClientEventOf<'show emoji'>
        actions.showEmoji({ playerId: event.playerId, emoji: event.emoji })
      },
    },
    actors: {
      loadParticipants: fromPromise(async () => {
        return ['a', 'b']
      }),
    },
    guards: {
      isHost: ({ context }) => context.hostPlayerId === context.playerId,
      isPlayer: ({ context }) => context.hostPlayerId !== context.playerId,
      // TODO
      gameNotStarted: () => true,
      // TODO
      gameFinished: () => false,
    },
  })
