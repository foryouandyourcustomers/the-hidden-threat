import { createMachine } from 'xstate'
import type { Context, ServerEvent } from './types'
import type { User } from '$lib/game/types'

export const machine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswGUwCcBuuAdAOLpiEByA9gC4AEsNKONkAxAK6y50BWVASwB2kANoAGALqJQAByqwBNAVSEyQAD0QAmAOzbCAFl0A2Qyd3iArIfEBGbQBoQAT0T6AzIQCchgBx2drYeht7ipgC+Ec6oGNj4RKQYlLQMTCzsKLCKUEIMAhBgEtJIIPKKyqrqWggeHn6Euv4eugF1emZWzm4Idt7ehFZDZpa6YeLmdlExZPEEOCRkKfSMzKwQhACC2QK5wlB0XLiwbMXq5UoqaqU1Hna6hNp2fpZBVh79ftbdiO9eViZtMZdIFLN4ptEQLEsLh5otktQVul1oQAEpgFAQFx0GhUNJrNirFgMMA0DiyM6lC6Va6gGomOqED7WEx2Oq6d5OVy-DwGcSA4EeCaGAEeaZQ2awxJLJJgOiYZHsMAaMAAYw4rDo0LoKFVNMpcgUlyqNx0Vgaxgmdis3g+ei63N6Vgmg3CgO0-L8xlt4uhc2lyVl8sVEDYOCoABsIwAjXUAay1ZB1equBrKRpp1TNFsshmttu89vEHh+vTqdh8Ni92hs3mdVl0vslCQWsvhcoVa3YaepVyzvUCBltzz8Jj83j8XonpcCVgrHueJmd1snQybcSlraW2DJsjYWRyeXDEaKUnOGb7poQo6sj3sDP0-MmdlLekMj0C-SCd3Nk8M65hFt20IHdyS2HY9iEA5jzgU4zypC8TTpRAJwrBltBMJdvDMQwPFZUsbArAEgV0EF7nEcEAP9LdklA2QtijOgYNgHUIJEUMADNhAEWAAAsSV3HtENpTREDsFlCD8DCPgBAEGRLR1LAMEwJzwoZ6jCKSqM3YCAHkcEKHABPJQlSToVVeOYXVWCMqgDNwISKkvZCEEw7wZ20RkzG8MZnmLPptD8bSgLbfTDOMvciXoaFHONESahHQgcNsPMx18cTDBncJb1CCZvIBEEfUhP0dMACnI6AAVWjAQAEcOCUKguFMoQIDoMA0CoXgBFizMrwAWkscRGi+Bl80na0HR6JcHkLCjbWFL0xWK5s4XKqravq3EmqOIyIB41VVBEPUxHgw0nKQ0SED68wvCXcRApadkMLsExS0BBoXr-d4vS9e5gtWyrqrqhrtu4IycDVQ61XWHrnMuvr6luqxtF8QxDEC6xR1LeoKwoj0PDnAtnQmf6iDWoHNsak4dvMqHjogWGLpqPrAnEBp3lI0x+WR-RdAIyxJNeSxeT6fR-2WjcQqWRF8QyUMD12PJMTQYRGfixBR0aJoQhrNHWnE9zHT6AYhgBa0LGwl5G3FIQqEKeBShKltz3O9WrtnExBhaUiTG5vQ9Ffd9TdZQELBkkbSZosAXbi-sUZnBxCGsM3SNHe7Rcj4CZaiyAY96lz+mxgIk4FeS620GtdCWmZJbhNts5DcDD32Q4wYds7Y6vII+cdTlBlLkVbDDzP69SHONnRTFsVxWWaDzuGajzAwhRuoZ7jGF4CN5fugU6If9G8EeZSTTs5fnpnfgbJOJ0nJo63EYtXqNubCCCHzwS+O5CyCiXALr7dSTknPm7UwDQ2bmgmhhX2uFSy2HZgKIeWEfJBCPrRQB9FtjNygkxSMcBgH9gCJ7cBAQhhQImApHoNghrEVyp6TydZUHkDogxCMOCTwsQVrkXOCFXb9nEqYRoi4H73SknhPwBFbA71wmENk4kGSMMIGFHg3Bdz4KvKRUs44hoBCBA2XkZEPgKIAGLcT4twju+dLpshdMbF6hMSIviNg4T2C5wR6AJujH+Nc-5k0BhtEG7d0y8P6oWT2VcvTTTwujGssD0ZMlaP0GsIR+hswUQ3LsGwRAAHd8SajsGolyBMvBBAsGRCubMpIES+EYe6FgVKjknOOKIUQgA */

  id: 'gameServer',

  context: ({ input }: { input: { gameId: string; host: User } }) => ({
    gameId: input.gameId,
    hostUserId: input.host.id,
    // TODO: this should get popullated with characters
    characters: [],
    users: [input.host],
    actions: [],
  }),

  types: {
    // typegen: {} as import('./machine.typegen').Typegen0,
    context: {} as Context,
    events: {} as ServerEvent,
    actors: {} as { loadParticipants: { output: string[] } },
  },

  states: {
    Game: {
      states: {
        'Not started': {
          initial: 'Assigning users',

          states: {
            'Assigning users': {
              always: [
                {
                  target: 'Ready to start',
                  guard: 'gameIsReadyToStart',
                },
              ],
            },

            'Ready to start': {
              on: {
                'start setup': {
                  guard: 'isAdmin',
                  target: '#gameServer.Game.Setup',
                },
              },
            },

            'new state 1': {},
          },

          on: {
            'user joined': {
              actions: ['storeNewUser', 'sendUsersUpdate'],
              target: 'Not started',
            },

            'assign side': {
              target: 'Not started',
              guard: 'isAdmin',
              actions: ['assignSide', 'sendUsersUpdate'],
            },

            'assign admin': {
              target: 'Not started',
              guard: 'isAdmin',
              actions: ['assignAdmin', 'sendUsersUpdate'],
            },
          },

          description: `All users are in the lobby, and the admins can define which side (attacker, defender or admin) a user belongs to.`,
        },

        'Game Started': {
          always: { target: 'Finished', guard: 'gameIsFinished' },

          on: {
            'execute game action': {
              target: 'Game Started',
              guard: 'isValidAction',
              actions: ['addGameAction', 'sendGameActionsUpdate'],
            },

            'rollback game action': {
              target: 'Game Started',
              actions: ['rollbackGameAction', 'sendGameActionsUpdate'],
            },
          },

          description: `The game is active and started. Now the server only waits for the game actions from the users.

![](https://www.svgrepo.com/show/323133/rolling-dices.svg)`,
        },

        Setup: {
          states: {
            'Assigning roles': {
              always: { target: 'All roles assigned', guard: 'allRolesHaveBeenAssigned' },
            },

            'All roles assigned': {
              on: {
                'finish setup': {
                  target: '#gameServer.Game.Order setup',
                  actions: 'chooseRandomAttack',
                },
              },
            },
          },

          initial: 'Assigning roles',

          on: {
            'assign role': {
              target: 'Setup',
              guard: 'isAdmin',
            },
          },

          description: `The users have been separated, and the defenders choose their role.`,
        },

        'Order setup': {
          on: {
            'set character order': {
              target: 'Order setup',
              guard: 'isAdmin',
              actions: 'storeCharacterOrder',
            },

            'start game': 'Game Started',
          },

          description: `The random attack has been determined now the defenders can choose the order in which they want to play.`,
        },

        Finished: {
          entry: 'sendSummary',
        },
      },

      initial: 'Not started',
    },

    '✨ Ubiquitous': {
      type: 'parallel',
      description: `This state only serves to group events that can happen at any time during the whole game lifecycle.`,

      on: {
        'send emoji': {
          target: '✨ Ubiquitous',
          actions: 'sendEmojiToOtherUsers',
        },

        'user disconnected': {
          actions: ['updateUserConnectionState', 'sendUsersUpdate'],
          target: '✨ Ubiquitous',
        },

        'user reconnected': {
          actions: ['updateUserConnectionState', 'sendUsersUpdate'],
          target: '✨ Ubiquitous',
        },

        'user connected': {
          actions: ['updateUserConnectionState', 'sendUsersUpdate'],
          target: '✨ Ubiquitous',
        },
      },
    },
  },

  type: 'parallel',
})
