import { createMachine } from 'xstate'
import type { Context, Player, ServerEvent } from './types'

export const machine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswGUwCcBuuAxAA4A2KAnrgAQDGA9gHaNi0AukA2gAwC6ioYvVgBLNiKYCQAD0QAWAOwA2AHQBmJQE4AHGs1qFcowoA0ICogC02ldu3cFAJiUKArHaUfHAX29nUGNj4RGSUNDisTCzsXHxSQqLikkgyiACM3GpytkquSnK6jgqZimYWCJZpqgoGavYOjvZK3Nyuvv7oWLgEOCTkVDjUECKwDMysHBA8-CkJYhKMUrIIbqracq7Ojg6uxetlVjZ2DS7u2p7n7SABXcG9sGCMENRgaPQAViLT8cLzyaDLNJpVwqYGadyaNJZYxKNQHBBKNIqBT6fTrY7cRpyK43II9FQAOXobGomDYKBwkxUAHUUPNGFBqAAzeiDUIDWB9MKDd70EQsKZxWa-JKLFLLNRqbgqTGuNL6BrnTSGeGuTYqFyeVyQzTbAppHGdPG4QnE0nkymQGl08QM5ms6js3Ccp08vkCzhpGaCEULJbpRwyvIabW6opabiaeFKRxqFRyRyubjo+pqIGGwLdE1EklkilUgBKYBQEAo1DY9GosAtbEIAAthCTq-nYNQbt9hYk-eLEMoQY5nK45Gpts17I54QnVNw5OD8q0qtoar4-CBGPQIHApLiszgfl3-qkKroVJph7C5C0FE4pVHzIhHIoVIOXNwIxpNLqM7d8TnzfnIH3P4xQBKw1BBM8NCyK8b0jeENEDTFEUfdZExabRv2NHBTVzGsrVpelGRZNl+mdIDRX9BAoUDeVkyKOVJRDOF7wQIxNBUTZETlRRdihJRMN3HD-0tCAVCLEsywrKsa3I7tQIQXZsjSS8Y24KpEVhNJJ1nDjnGohwrzSDDVx3O4VAAcU6YTJlkw9ARaaUFCMxNHHlR8FF0eCsmRXIXBRNIUUvfQBLMyyMGsq0AElGHmFBSFskCjwyApkWczY3MUTyWLkLRn1yJzMUTZVnAUFdvCAA */

  id: 'gameServer',

  context: ({ input }: { input: { gameId: string; host: Player } }) => ({
    gameId: input.gameId,
    hostPlayerId: input.host.id,
    players: [input.host],
  }),

  types: {
    // typegen: {} as import('./machine.typegen').Typegen0,
    context: {} as Context,
    events: {} as ServerEvent,
    actors: {} as { loadParticipants: { output: string[] } },
  },

  initial: 'Not Started',

  states: {
    'Not Started': {
      initial: 'Waiting for players',

      states: {
        'Waiting for players': {
          on: {
            'player joined': [
              {
                target: 'Ready to start',
                guard: 'allPlayersJoined',
                actions: ['storeNewPlayer', 'sendPlayersUpdate'],
              },
              {
                actions: ['storeNewPlayer', 'sendPlayersUpdate'],
              },
            ],
          },
        },
        'Ready to start': {
          on: {
            'host starts game': {
              actions: 'consoleLogValue',
              target: '#gameServer.Game Started',
            },
          },
        },
      },
    },

    'Game Started': {
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
  },

  on: {
    'player connected': {
      actions: ['updatePlayerConnectionState', 'sendPlayersUpdate'],
      target: '#gameServer',
    },

    'player reconnected': {
      actions: ['updatePlayerConnectionState', 'sendPlayersUpdate'],
      target: '#gameServer',
    },

    'player disconnected': {
      actions: ['updatePlayerConnectionState', 'sendPlayersUpdate'],
      target: '#gameServer',
    },

    'send emoji': {
      target: '#gameServer',
      actions: 'sendEmojiToOtherPlayers',
    },
  },
})
