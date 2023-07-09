import { createMachine } from 'xstate'
import type { Context, ServerEvent } from './types'
import type { User } from '$lib/game/types'

export const machine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswGUwCcBuuAdAOLpiEByA9gC4AEsNKONkAxAK6y50BWVASwB2kANoAGALqJQAByqwBNAVSEyQAD0QAmAOzbCAFl0A2Qyd3iArIfEBGbQBoQAT0T6AzIQCchgBx2drYeht7ipgC+Ec6oGNj4RKQYlLQMTCzsKLCKUEIMAhBgEtJIIPKKyqrqWggeHn6Euv4eugF1emZWzm4Idt7ehFZDZpa6YeLmdlExZPEEOCRkKfSMzKwQbFk5eSgQaMLF6uVKKmqlNX4mjU0h2jbGAeLe3Yh9A0NWJnafYyZ+urppiBYlhcPNFslqCt0utCABBbICXLCKB0Li4WBsQ6lY6VM6gGoeOy6QjaOz-eyGKwefp+awvBDUryfbTGXSBSzeKbRYGzMGJJZQtJrSCEABKYF2LjoNCowpYbFWLAYYBoHFk2LkChOVXOiBMdUINOsXzqumpTlciAthHEJlZAI8EypBqBILmAuSSTAdEwMPYYA0YAAxhxWHQQXQUMG8Zqytq8dUdFYGsYJt9vDS9F0rb0rBNBuF7do7X5jJm3XyEgtvRCfX6RRscFQADYtgBG0YA1hGyFGY6c47jTkmEHdU5ZDBms+bxB4GXY6nYfDYy3dQvmrICee7+TWlt7ff6NkOEyO9b1AgZM+TLn5vH4yw+F99lyXySZ899H0NK3E93WhDYGqsibIiuR0M2LZFFIRxnrqBKIJcVikvYBr6Hakx2AyeiGKSgT9EERIpo+hh-qC1aAcB6rwuBQgopBrZwFisE4vB+KaIgD7Lga2gmJ+3hmIYHhfAyNjLiybIck83IzP+lG1tRsjwm2jHQbAUZ0ewABmwgCLAAAWKogaeFTnohvQmoQfh8TSnyfAa865pYBgmA+IlDPUYQ2eRHr7skADyOCFDgxnqoqqp0MGBnMNGrChVQwW4KZOocTU-HPLmDiGmY3hjOSc59Nofi+QBtZBSFYWgUq9AgiliYXrehBCbYU5-L4dgTAu4QoaEEy5T8fQeKVlGABTkdAAKrtgIACOHBKFQXARUIEB0GAaBULwAj1eZnEIAAtJY4iNHSBoZo+3w5j0n4kt4Jb9E6hj+MJI3guNU2zfNspLeioUQPpwaqCIMZiKxWpmQhe37eYXifuIxUtGafF2CYDL2g0KOkdSZZlsSr1EO901zQtP3cKFOAhkDIbrDtkM1Pt9Sw1Y2i+E9xXWJcDL1MuTwlh4VhDd4+YTPjCyE59JOYr9UVUyDEC02liD7YE4gNNSAKmHazP6LoYmWNZljEnOZJ5ayUQ8kIVCFPApS7tWcEQ4rB2BJ8gwtACJha3oeg4XhHxfF8eX89oJYlTuVbgt6DupaOLMvgY1ifNOfgC-0Vii4BQo1ZA0cNRZ-RcwEtr2uYQmq-D3wZ7WWfHrR2wMb9NvgzHjXGGJHgGJJnS2BYw3h-JkeCqk2cQOKkoQNKsryjQue7TUU4GI9BpDMSYz-O3ncl93dr6N4VcHn2DYZBAs909aW62g+j5NEL4hzqjWVPAMQR5VydJEndYdyRRg-JEpp9O1MA0VWKZLp8U9sJBktg1Ylw7hhUwhhtD7z-qqGiCJ65CFRFBOAADRwBCuCAgIQxwETCcj0Gwx1JLjD+NoOyyDyBKRUi2NScBNLbBzmxR2o5OqmEaB+O+8MbIiT8GJWwgxYFhEXJ1V0-cf6enIBVHg3AQK4IvACBk95joBFZFuOBgQaT0MIAAMT0oZDhzc857UXAWN4KNU4OmwllBwVx3xcj0PzRBX9eQDwJpNImX1FpN3jFwi8+07pXF0PUcwuizAhyuogNmRpWj9DuCEfoqtzYRCAA */

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
