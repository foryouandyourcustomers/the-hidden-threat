import { createMachine } from 'xstate'
import type { Context, Player, ServerEvent } from './types'

export const machine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswGUwCcBuuAxAA4A2KAnrgAQDGA9gHaNi0AukA2gAwC6ioYvVgBLNiKYCQAD0QAOAKwA6AEwBGbgE4VANh0qFKxSoA0ICojUB2JTqs7N3FdoDMazVYXcXAXx9nUDGx8IjJKGggRWAZmVg4IHn4kECFRcUlk2QQAFhVspRcFbKtuexd1d00zCwQAWhVuJTU1B3VynW9NFx05PwD0LFwCHCUAOXo2akw2FBx4pQB1FDERRihqADN6HGowqhxYEnJ96gArelWuPilUlYzQLJcXRqcFd2erIwcrbOrEBUMtnsik07ga2Tkaj6IECgxCI3Gk2ms3mSxWa02212x1whz2NHOlwSaiSgmEd0YUiy6lsakK3Gy3G41lybxcfwQCjkjSsimyEOyoIUoM00NhwWGYwmUxmc0gSgASmAUBAKNQ2PRqLBZWxCAALYSTbUo2DUWGJG7k9KUzKIezKFS6IrlbgdbmmcyIXI6JQMzQKHSMt49Ky+aGMegQOBScVDXCWtISG0PRC1H4FOSB-2aTRyAw-KqehB5Gwqex0op57T6bJigYS3BSpE6yAJilU1O6DNZ4W5-MQqwc7oqX26DSFDSfHRQ-ww+txhHS5FyiCLZbiDFbHb4g5t60dhB0kfubh5zx0p46BTsov8zRKQzTt7FBRWOk6OtBBdNmUo+VKlU1Q1LUdT3JMD1ffI1EZfRmT0Fo3A5O8HzHF0SlKNRelnWN4SUABxAZfxXMD7hkRAuhcX1sh6HoA2ycpBSHFx8iscsDBUZ5czkflPzhSUCIwIj5gASUYFYUFIEjkzIhBczUKiaMUQMGMLGpqPvMtpwrOQ5B+KxRT8HwgA */

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
    'player disconnected': {
      actions: ['updatePlayerConnectionState', 'sendPlayersUpdate'],
      target: '#gameServer',
    },
  },
})
