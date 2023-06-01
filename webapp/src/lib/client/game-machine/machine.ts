import { createMachine } from 'xstate'
import type { ClientEvent, Context } from './types'

export const machine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswGEA2BLMAdgC4DEADtigJ5gBOsABAK5kQpFgDaADALqKgyAe1i4iuIQQEgAHogDMATgB0ARgAsAVlWb5AJn0GAHJoA0IKogBsilVYDsmq-O5Oj6xfM0Bfb+dQYOPjE5JQ0tAywhBCMYGhCAFa4PPxIIMKi4pLScgh69vLK8lZ6Rkb6ivmqqvbmlgg2do7Orlbunj5+IAFYeIREygCSBGK4KNgkKdIZo9lpuQ7K3HrcNVbqJtyVnnWIqoqqyvaKmprqWprcRpVlvv7ovcEDw6Pjk6qpgiKzUvN7ekV1PYNPZlqt7OpnEZdgh5EYAVZXKsbPJ1PtVHo7t0HkF+kMRuI3pw9J90t8sr9QLl1Fslpo9J5VO5Lup9DDdIUHOdjhzXHpVFierjiMoADJCABGEqoJCYUQisCIKFoREYPSmaRmFJy1jhykU1xMej0NNOqnkMOqh30wNZ1UU3H0nXugT6IvFUqo+NeEw1X0yEkpsgUSmU6n5DsuDv0qislvpyjONU0nlWRlUrnsgpxboGHul3sJvo+03JgZ1sPkh2W6zK+lRjnUMNR6mUKwxOm4JSMrmzrqeJFgAAshAB3BhxRLJPilgNzKmIJyHPRWbTyfRWDF6GGg7jKcocrlgrNYghCCBwaRC3Ozn4VgC0RnsYe49iMNn59N0-Jh99RRw8a44Xkex7BKZE+0ePEXiLW9tT+BA-xUGk3w-HQ9G-DRLQdNsTlORQwIZFZSkg4VngIHo4PLBD3ysNtuFcJ8uQZWx2QBRwGIdHs31OOErFI3N8R6QsxmwKj52DBADlbFZGLAiEWMUS0nzbS4tg5Kt6UUASnjFSVpXEoNcn2AFUU3elqhpTc2hhVcljRUDISXRkTxdKD3X0r0AEFGBHRVDIrDw9wMUowPNFcnGbNF9W0Aw3x7dxEVc7F+zxfNvMYChqDoAKEK0IwilWDRX3TMpHJhFcAXNV8V0RSzih0tLPJE8ZctAIghDIRBSkOSpLiZQimWqcxsDAAAzIhuppQFzP5YrrOhEAJSEIgOrQBQGX1DC00G9NVHMWhcCgIdJthREZvQyyuxqcxR1wCAiCHf5uHMIcwCOk7EA2cxchNPczMu+bY0W+oeq2-qmP5PbGpFAAxXARmHSA2sk2MjgNWxAO0HQbBBxcan1Ks3wwonQIFXxvCAA */

  id: 'gameClient',

  context: ({ input }) => ({
    gameId: input.gameId,
    playerId: input.playerId,
    hostPlayerId: input.hostPlayerId,
    players: [],
  }),

  types: {
    // typegen: {} as import('./machine.typegen').Typegen0,
    context: {} as Context,
    events: {} as ClientEvent,
    actors: {} as { loadParticipants: { output: Promise<string[]> } },
  },

  initial: 'Initial',

  states: {
    Initial: {
      always: [
        {
          target: 'Lobby',
          guard: 'gameNotStarted',
        },
        {
          target: 'Finished',
          guard: 'gameFinished',
        },
        {
          target: 'Ingame',
        },
      ],
    },

    Ingame: {
      entry: ['consoleLogValueAgain'],

      states: {
        Initial: {
          invoke: {
            src: 'loadParticipants',
          },
        },
      },

      initial: 'Initial',
    },

    Lobby: {
      on: {
        'user starts game': {
          actions: 'consoleLogValue',
          target: 'Ingame',
        },
      },

      states: {
        'As host': {},
        'As player': {},
        Initial: {
          always: [
            'As player',
            {
              target: 'As host',
              guard: 'isHost',
            },
          ],
        },
      },

      initial: 'Initial',
    },

    Finished: {},
  },

  on: {
    'players update': {
      target: '#gameClient',
      actions: 'updatePlayers',
    },

    'player sends emoji': {
      target: '#gameClient',
      actions: 'sendEmoji',
    },

    'show emoji': {
      target: '#gameClient',
      actions: 'showEmoji',
    },
  },
})
