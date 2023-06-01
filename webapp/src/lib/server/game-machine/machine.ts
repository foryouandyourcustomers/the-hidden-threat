import { createMachine } from 'xstate'
import type { Context, Player, ServerEvent } from './types'

export const machine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswGUwCcBuuAxAA4A2KAnrgAQDGA9gHaNi0AukA2gAwC6ioYvVgBLNiKYCQAD0QAmAMxyAdADYAnAtUBWAIwLtADmMAWIwBoQFRAFoA7Mu7cThrSdV25hjbvUBfP0tUDGx8IjJKGhxWJhZ2Lj4pIVFxSSQZW10TbjVDbk9vQxN1dTlLawR7R2dDOV0NBU8TFwCg9CxcAhwSciocaggRWAZmVg4IHn505LEJRilZBD1VZW1PbRNPbgaFQ3LbL2UXbW51OzW7VW4vE1aQYI6w7tgwRghqMDR6ACsRSaThLM0qBFtx9ghuHcHqEusoAHL0NjUTBsFA4cbKADqKFmjCg1AAZvR+hE+rAepF+t96CIWBNEtNAal5ulFgoFDlrnpNPkvBo7CZwdptCoPKpDNp1L45DVdFD2jDcPDEcjUejIFiceI8YTidRSbhyQaqTS6ZxdFNBEy5gt5Lo1PoTtluLoBXI9AohXllHYJc0ilLJb55SFOkqEUiUWiMQAlMAoCAUahsejUWBqtiEAAWwiR6ejsGoD3+jJSNtZiEu2mUcjkOhMSm23DyZSsiBMdccxW0qmyy0MdgUAUCIEY9AgcCk0LDOABZeBGUqAuUu176kl6lqa2K4Lkmxrl227I82ylqhDj1hEdV0cgc6BLJBBxWq+7JS3AoH4K0Kmuql0rp1goZyGHKI7Tk8yqRhmGrYri+JEiSvSGvezK2gg+gqL4zZyOc+jHtonptggzTqKsda6HomxrPo57gQqM5QTe6oQMocYJkmKZphmqHlk+SzLlk2wyvU-6qAoujgqR5H-o2dhOHYuiGBeio4MoADi7TMeMvELosmgKF24rij2DZ7uo34KCYPqHr6roSaocj+PRoaQZpGDaRqACSjCzCgpC6Y+i6bvazjGRKvZKDuxHuGRuH-o6xgCnYzkBEAA */

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
