import { createMachine } from 'xstate'
import type { ClientEvent, Context } from './types'

export const machine = createMachine({
  id: 'gameClient',

  context: ({ input }: { input: Context }) => input,

  types: {
    // typegen: {} as import('./machine.typegen').Typegen0,
    context: {} as Context,
    events: {} as ClientEvent,
    actors: {} as { loadParticipants: { output: Promise<string[]> } },
  },

  initial: 'Lobby',

  states: {
    Lobby: {
      initial: 'Assigning sides',
      states: {
        'Assigning sides': {
          description:
            'This is the first step of the game setup, where users can join and are assigned to be either attacker or defender.\n\nUsers can also be made administrators.',
          initial: 'Incomplete',
          states: {
            Incomplete: {
              always: {
                target: 'Ready',
                guard: 'allSidesAssigned',
                description:
                  'All users have been assigned a side and there is an admin on both sides',
                reenter: false,
              },
            },
            Ready: {
              on: {
                'next step': {
                  target: 'Ready',
                  guard: 'isAdmin',
                  actions: {
                    type: 'forwardToServer',
                    params: {},
                  },
                  reenter: false,
                },
              },
            },
          },
          always: {
            target: 'Assigning roles',
            guard: 'finishedAssigningSides',
            reenter: false,
          },
          on: {
            'assign side': {
              target: 'Assigning sides',
              guard: 'isAdmin',
              actions: {
                type: 'forwardToServer',
                params: {},
              },
              reenter: false,
            },
            'assign admin': {
              target: 'Assigning sides',
              guard: 'isAdmin',
              actions: {
                type: 'forwardToServer',
                params: {},
              },
              reenter: false,
            },
          },
        },
        'Assigning roles': {
          description: 'All users have been assigned a side, and now the roles will be configured.',
          initial: 'Incomplete',
          states: {
            Incomplete: {
              always: {
                target: 'Ready',
                guard: 'allRolesAssigned',
                description: 'All users have been assigned a role.',
                reenter: false,
              },
            },
            Ready: {
              on: {
                'next step': {
                  target: 'Ready',
                  guard: 'isAdmin',
                  actions: {
                    type: 'forwardToServer',
                    params: {},
                  },
                  reenter: false,
                },
              },
            },
            'Editing player': {
              description: 'Shows a modal where the admin can select the user, role and face image',
              entry: {
                type: 'forwardToServer',
                params: {},
              },
              exit: {
                type: 'forwardToServer',
                params: {},
              },
              on: {
                'assign role': {
                  target: 'Editing player',
                  guard: 'isAdmin',
                  actions: {
                    type: 'forwardToServer',
                    params: {},
                  },
                  reenter: false,
                },
                'stop editing player': {
                  target: 'Incomplete',
                  guard: 'isAdmin',
                  reenter: false,
                },
              },
            },
          },
          always: {
            target: 'Waiting for other side',
            guard: 'finishedAssigningRoles',
            reenter: false,
          },
          on: {
            'start editing player': {
              target: '.Editing player',
              guard: 'isAdmin',
              reenter: false,
            },
          },
        },
        'Waiting for other side': {},
      },
      always: {
        target: 'Playing',
        guard: 'gameStarted',
        reenter: false,
      },
    },
    Playing: {
      states: {
        Gameloop: {
          initial: 'Waiting',
          states: {
            Waiting: {
              always: {
                target: 'Playing',
                guard: 'userOnActiveSide',
                reenter: false,
              },
            },
            Playing: {
              initial: 'Ready to move',
              states: {
                'Ready to move': {
                  always: {
                    target: 'Ready for action',
                    guard: 'playerMoved',
                    reenter: false,
                  },
                  on: {
                    'apply game event': {
                      target: 'Ready to move',
                      guard: 'userControlsPlayerAndIsMoveEvent',
                      actions: {
                        type: 'forwardToServer',
                        params: {},
                      },
                      reenter: false,
                    },
                  },
                },
                'Ready for action': {
                  always: {
                    target: 'Ready to move',
                    guard: 'playerPerformedAction',
                    reenter: false,
                  },
                  on: {
                    'apply game event': {
                      target: 'Ready for action',
                      guard: 'userControlsPlayerAndIsActionEvent',
                      actions: {
                        type: 'forwardToServer',
                        params: {},
                      },
                      reenter: false,
                    },
                  },
                },
              },
              always: {
                target: 'Waiting',
                guard: 'userNotOnActiveSide',
                reenter: false,
              },
            },
          },
        },
        'Global Attack': {
          initial: 'Showing current global attack',
          states: {
            'Showing current global attack': {
              on: {
                'dismiss global attack': {
                  target: 'Dismissed',
                  reenter: false,
                },
              },
            },
            Dismissed: {
              on: {
                'new global attack': {
                  target: 'Showing current global attack',
                  reenter: false,
                },
                'show global attack': {
                  target: 'Showing current global attack',
                  reenter: false,
                },
              },
            },
          },
        },
        Sides: {
          initial: 'Initial',
          states: {
            Initial: {
              always: [
                {
                  target: 'Defense',
                  guard: 'userIsDefender',
                  reenter: false,
                },
                {
                  target: 'Attack',
                  reenter: false,
                },
              ],
            },
            Defense: {
              states: {
                'Attacker visibility': {
                  initial: 'Invisible',
                  states: {
                    Invisible: {
                      always: {
                        target: 'Visible',
                        guard: 'attackerShouldBeVisible',
                        reenter: false,
                      },
                    },
                    Visible: {
                      always: {
                        target: 'Invisible',
                        guard: 'attackerShouldBeInvisible',
                        reenter: false,
                      },
                    },
                  },
                },
              },
              type: 'parallel',
            },
            Attack: {},
          },
          on: {
            'switch sides': {
              target: 'Sides',
              guard: 'isAdmin',
              actions: {
                type: 'forwardToServer',
                params: {},
              },
              reenter: false,
            },
          },
        },
      },
      always: {
        target: 'Finished',
        guard: 'gameFinished',
        reenter: false,
      },
      type: 'parallel',
    },
    Finished: {
      description: 'The game finished, but the users can still communicate by sending emojis.',
    },
    'Server stopped': {
      type: 'final',
    },
  },
  always: {
    target: '.Server stopped',
    guard: 'isServerStopped',
    reenter: false,
  },
  on: {
    'shared game context update': {
      target: '#gameClient',
      actions: {
        type: 'updateSharedGameContext',
        params: {},
      },
      reenter: false,
    },
    'send emoji': {
      target: '#gameClient',
      actions: {
        type: 'forwardToServer',
        params: {},
      },
      reenter: false,
    },
    'show emoji': {
      actions: {
        type: 'showEmoji',
        params: {},
      },
      reenter: true,
    },
  },
})
