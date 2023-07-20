import { DEFAULT_ATTACK_INVENTORY, DEFAULT_DEFENSE_INVENTORY } from '$lib/game/constants'
import type { User } from '$lib/game/types'
import { createMachine } from 'xstate'
import type { Context, ServerEvent } from './types'

export const machine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswGUwCcBuuAdAOLpiEByA9gC4AEsNKONkAxAK6y50BWVASwB2kANoAGALqJQAByqwBNAVSEyQAD0QAmAOzbCAFl0A2Qyd3iArIfEBGbQBoQAT0T6AzIQCchgBx2drYeht7ipgC+Ec6oGNj4RKQYlLQMTCzsKLCKUEIMAhBgEtJIIPKKyqrqWggeHn6Euv4eugF1emZWzm4Idt7ehFZDZpa6YeLmdlExZPEEOCRkKfSMzKwQbFk5eSgQaMLF6uVKKmqlNX4mjU0h2jbGAeLe3Yh9A0NWJnafYyZ+urppiBYlhcPNFslqCt0utCABBbICXLCKB0Li4WBsQ6lY6VM6gGoeOy6QjaOz-eyGKwefp+awvBDUryfbTGXSBSzeKbRYGzMGJJZQtJrSCEABKYF2LjoNCowpYbFWLAYYBoHFk2LkChOVXOiBMdUINOsXzqumpTlciAthHEJlZAI8EypBqBILmAuSSTAdEwMPYYA0YAAxhxWHQQXQUMG8Zqytq8dUdFYGsYJt9vDS9F0rb0rBNBuF7do7X5jJm3XyEgtvRCfX6RRscFQADYtgBG0YA1hGyFGY6c47jTkmEHdU5ZDBms+bxB4GXY6nYfDYy3dQvmrICee7+TWlt7ff6NkOEyO9b1AgZM+TLn5vH4yw+F99lyXySZ899H0NK3E93WhDYGqsibIiuR0M2LZFFIRxnrqBKIJcVikvYBr6Hakx2AyeiGKSgT9EERIpo+hh-qC1aAcB6rwuBQgopBrZwFisE4vB+KaIgD7Lga2gmJ+3hmIYHhfAyNjLiybIck83IzP+lG1tRsjwm2jHQbAUZ0ewABmwgCLAAAWKogaeFTnohvQmoQfh8TSnyfAa865pYBgmA+IlDPUYQ2eRHr7skADyOCFDgxnqoqqp0MGBnMNGrChVQwW4KZOocTUBoSRMZh0kE2j1LoDL9F44hli0bKWJcvkAbWQUhWFoFKvQIIpYmF63oQQm2FOfy+HYEwLuEKGhFlG4WH0HhVZRACq7YCAAjhwShUFwEVCBAdBgGgVC8AILXmZxCAALSWOIjR0hlVgPgEQwMp+JLeCWRXOqVk3gjN82LbKK3oqFED6cGqgiDGYisVqZkIQdh3mF4n7iNofgtGafF2CYt3w4QKOkdSZZlsSr1EO9C1Ld93ChTgIaAyG6x7RDNSHfUMNWNoviGIY8PWJcDL1MuTwlh4Vjjd4+YTPjCyE59y2Yj9UWU8DEA02liCHYEJWDC0AImHaTP6AVuZbqdFLEnOZLePoZFAkIVCFPApS7tWcHg4rR2BJ8asAqYWt6HoOF4R8XzCfe9T3lYot1g7qWjszL4GNYnzfHOVIMxNO5VuCtZCo1kDh61Fn9FzAS2vaVL2B4zPiE8Icp-JaeCqkmcQLR2wMT9NtgxHbXGGJpeDEXnS2BYydyRRNeQnXx7ipKEDSrK8o0Nn+01FOBhOtDQzEmM-xdwYkl93a+jeKHtaHg2GQQPPtPWlutpXf8G7lyJA39BjoRjOSc59PDh9LEp59O6YDQlRTN8Jm-EJhOR6LYBoklWalX+EEL+yQlKNyRPRIQqIoJwF-qOAIVxAHXRAZrYSYlbA91ZOMP4eUhYIPIEguEqkMEaS2CgrObFHajj6qYRoH5y5wxsiJPwxDTqSWNIuPqroq7D09OQWqPBuAgSwReAEDJ7wGwcFSXQpd2SLgPhIvygEABielDIsLbjnA6i4CxvBRgLB6xhsK5ivFcd8XI9D8zZn4UO4tiat3jGwi8h0HpXA0WWO6Ik2Z3AZKzZerR+h3BCP0EqUQohAA */

  id: 'gameServer',

  context: ({ input }: { input: { gameId: string; host: User } }) =>
    ({
      gameId: input.gameId,
      hostUserId: input.host.id,
      finishedAssigningSides: false,
      globalAttackScenarios: ['todo', 'todo', 'todo', 'todo'],
      defense: {
        finishedConfiguring: false,
        defenders: [],
        inventory: { ...DEFAULT_DEFENSE_INVENTORY },
      },
      attack: {
        finishedConfiguring: false,
        attacker: undefined,
        inventory: { ...DEFAULT_ATTACK_INVENTORY },
      },
      users: [input.host],
      actions: [],
    } satisfies Context),

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

    Ubiquitous: {
      type: 'parallel',
      description: `✨ This state only serves to group events that can happen at any time during the whole game lifecycle.`,

      on: {
        'send emoji': {
          target: 'Ubiquitous',
          actions: 'sendEmojiToOtherUsers',
        },

        'user disconnected': {
          actions: ['updateUserConnectionState', 'sendUsersUpdate'],
          target: 'Ubiquitous',
        },

        'user reconnected': {
          actions: ['updateUserConnectionState', 'sendUsersUpdate'],
          target: 'Ubiquitous',
        },

        'user connected': {
          actions: ['updateUserConnectionState', 'sendUsersUpdate'],
          target: 'Ubiquitous',
        },
      },
    },
  },

  type: 'parallel',
})
