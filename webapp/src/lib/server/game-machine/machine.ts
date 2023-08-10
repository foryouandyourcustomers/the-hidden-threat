import {
  DEFAULT_ATTACK_INVENTORY,
  DEFAULT_DEFENSE_INVENTORY,
  INITIAL_BOARD_ITEMS,
} from '$lib/game/constants'
import type { User } from '$lib/game/types'
import { createDefaultAttacker, createDefaultDefender } from '$lib/server/game/utils'
import cloneDeep from 'lodash/cloneDeep'
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
      items: cloneDeep(INITIAL_BOARD_ITEMS),
      globalAttackScenarios: ['todo', 'todo', 'todo', 'todo'],
      defense: {
        finishedAssigning: false,
        defenders: [
          createDefaultDefender(input.host.id, 'defender0'),
          createDefaultDefender(input.host.id, 'defender1'),
          createDefaultDefender(input.host.id, 'defender2'),
          createDefaultDefender(input.host.id, 'defender3'),
        ],
        inventory: { ...DEFAULT_DEFENSE_INVENTORY },
      },
      attack: {
        finishedAssigning: false,
        attacker: createDefaultAttacker(input.host.id),
        inventory: { ...DEFAULT_ATTACK_INVENTORY },
      },
      users: [input.host],
      events: [],
    } satisfies Context),

  types: {
    // typegen: {} as import('./machine.typegen').Typegen0,
    context: {} as Context,
    events: {} as ServerEvent,
    actors: {} as { loadParticipants: { output: string[] } },
  },

  states: {
    Game: {
      initial: 'Assigning sides',
      states: {
        'Assigning sides': {
          description:
            'All users are in the lobby, and the admins can define which side (attacker, defender or admin) a user belongs to.',
          initial: 'Incomplete',
          states: {
            Incomplete: {
              always: {
                target: 'Ready',
                guard: 'allSidesAssigned',
                reenter: false,
              },
            },
            Ready: {
              on: {
                'user: next step': {
                  target: '#gameServer.Game.Assigning roles',
                  guard: 'isAdmin',
                  actions: {
                    type: 'setAssigningSidesFinished',
                    params: {},
                  },
                  reenter: false,
                },
              },
            },
          },
          on: {
            'user joined': {
              target: 'Assigning sides',
              actions: {
                type: 'storeNewUser',
                params: {},
              },
              reenter: false,
            },
            'user: assign side': {
              target: 'Assigning sides',
              guard: 'isAdmin',
              actions: {
                type: 'assignSide',
                params: {},
              },
              reenter: false,
            },
            'user: assign admin': {
              target: 'Assigning sides',
              guard: 'isAdmin',
              actions: {
                type: 'assignAdmin',
                params: {},
              },
              reenter: false,
            },
          },
        },
        Playing: {
          description:
            'The game is active and started. Now the server only waits for the game events from the users.',
          always: {
            target: 'Finished',
            guard: 'gameFinished',
            reenter: false,
          },
          on: {
            'user: move': {
              guard: 'isValidGameEvent',
              actions: {
                type: 'addOrUpdateGameEvent',
                params: {},
              },
              reenter: true,
            },
            'rollback game event': {
              guard: 'isAdmin',
              actions: {
                type: 'rollbackGameEvent',
                params: {},
              },
              reenter: true,
            },
            'user: perform action': {
              target: 'Playing',
              guard: 'isValidGameEvent',
              actions: {
                type: 'addOrUpdateGameEvent',
                params: {},
              },
              reenter: false,
            },
          },
        },
        'Assigning roles': {
          description: 'The users have been separated, and the defenders choose their role.',
          initial: 'Incomplete',
          states: {
            Incomplete: {
              always: {
                target: 'Ready',
                guard: 'allRolesAssigned',
                reenter: false,
              },
            },
            Ready: {
              always: {
                target: '#gameServer.Game.Playing',
                guard: 'finishedAssigningRoles',
                reenter: false,
              },
            },
          },
          on: {
            'user: assign role': {
              target: 'Assigning roles',
              guard: 'isAdmin',
              actions: {
                type: 'updatePlayer',
                params: {},
              },
              description:
                'Defines which user controls a player, which role they are and how they look.\n\nThis event can update a defender and an attacker.',
              reenter: false,
            },
            'user: start editing player': {
              target: 'Assigning roles',
              guard: 'isAdmin',
              actions: {
                type: 'setEditingPlayer',
                params: {},
              },
              reenter: false,
            },
            'user: stop editing player': {
              target: 'Assigning roles',
              guard: 'isAdmin',
              actions: {
                type: 'setEditingPlayer',
                params: {},
              },
              reenter: false,
            },
            'user: next step': {
              guard: 'isAdmin',
              actions: {
                type: 'setAssigningRolesFinished',
                params: {},
              },
              reenter: true,
            },
          },
        },
        Finished: {
          entry: {
            type: 'sendSummary',
            params: {},
          },
        },
      },
    },
    Ubiquitous: {
      description:
        '✨ This state only serves to group events that can happen at any time during the whole game lifecycle.',
      on: {
        'user: send emoji': {
          actions: {
            type: 'sendEmojiToOtherUsers',
            params: {},
          },
          reenter: true,
        },
        'user disconnected': {
          actions: {
            type: 'updateUserConnectionState',
            params: {},
          },
          reenter: true,
        },
        'user reconnected': {
          actions: {
            type: 'updateUserConnectionState',
            params: {},
          },
          reenter: true,
        },
        'user connected': {
          actions: {
            type: 'updateUserConnectionState',
            params: {},
          },
          reenter: true,
        },
      },
      type: 'parallel',
    },
  },
  type: 'parallel',
})
