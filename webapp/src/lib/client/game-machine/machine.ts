import { createMachine } from 'xstate'
import type { ClientEvent, Context } from './types'

export const machine = createMachine({
  id: 'gameClient',

  context: ({ input }: { input: Context }) => input,

  types: {
    // typegen: {} as import('./machine.typegen').Typegen0,
    context: {} as Context,
    events: {} as ClientEvent,
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
                  },
                  reenter: false,
                },
              },
            },
          },
          always: {
            target: 'Assigning roles',
            guard: 'finishedAssigningSides',
          },
          on: {
            'assign side': {
              target: 'Assigning sides',
              guard: 'isAdmin',
              actions: {
                type: 'forwardToServer',
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
              always: [
                {
                  target: 'Ready',
                  guard: 'allRolesAssignedOfSide',
                  description: 'All users have been assigned a role.',
                },
                {
                  target: 'Editing player',
                  guard: 'isEditingPlayerOfSide',
                },
              ],
            },
            Ready: {
              always: {
                target: 'Editing player',
                guard: 'isEditingPlayerOfSide',
              },
              on: {
                'next step': {
                  target: 'Ready',
                  guard: 'isAdmin',
                  actions: {
                    type: 'forwardToServer',
                  },
                  reenter: false,
                },
              },
            },
            'Editing player': {
              description: 'Shows a modal where the admin can select the user, role and face image',
              always: {
                target: 'Incomplete',
                guard: 'isNotEditingPlayerOfSide',
              },
              on: {
                'assign role': {
                  target: 'Editing player',
                  guard: 'isAdmin',
                  actions: {
                    type: 'forwardToServer',
                  },
                  reenter: false,
                },
              },
            },
          },
          always: {
            target: 'Waiting for other side',
            guard: 'finishedAssigningRolesOfSide',
          },
          on: {
            'start editing player': {
              target: 'Assigning roles',
              guard: 'isAdmin',
              actions: {
                type: 'forwardToServer',
              },
              reenter: false,
            },
            'stop editing player': {
              target: 'Assigning roles',
              guard: 'isAdmin',
              actions: {
                type: 'forwardToServer',
              },
              reenter: false,
            },
          },
        },
        'Waiting for other side': {},
      },
      always: {
        target: 'Playing',
        guard: 'finishedAssigningRoles',
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
              },
            },
            Playing: {
              initial: 'Initial',
              states: {
                Initial: {
                  always: [
                    {
                      target: 'Placing',
                      guard: 'requiresPlacement',
                    },
                    {
                      target: 'Reacting',
                      guard: 'requiresReaction',
                    },
                    {
                      target: 'Moving',
                    },
                  ],
                },
                Placing: {
                  description: 'The user sees all possible starting positions',
                  always: {
                    target: 'Moving',
                    guard: 'requiresMove',
                  },
                  on: {
                    'apply game event': {
                      target: 'Placing',
                      guard: 'userControlsPlayer isPlacementEvent',
                      actions: {
                        type: 'forwardToServer',
                      },
                      reenter: false,
                    },
                  },
                },
                Reacting: {
                  description: 'The defender asked something, and the attacker needs to respond.',
                  always: {
                    target: 'Moving',
                    guard: 'requiresMove',
                  },
                },
                Moving: {
                  description: 'The board displays possible squares to move to',
                  always: {
                    target: 'Action',
                    guard: 'requiresAction',
                  },
                  on: {
                    'apply game event': {
                      target: 'Moving',
                      guard: 'userControlsPlayer isMoveEvent',
                      actions: {
                        type: 'forwardToServer',
                      },
                      reenter: false,
                    },
                  },
                },
                Action: {
                  description: 'The user gets presented with a list of possible actions to perform',
                  always: {
                    target: 'Moving',
                    guard: 'requiresMove',
                  },
                  on: {
                    'apply game event': {
                      target: 'Action',
                      guard: 'userControlsPlayer isActionEvent',
                      actions: {
                        type: 'forwardToServer',
                      },
                      reenter: false,
                    },
                    'cancel game event': {
                      target: 'Action',
                      guard: 'userControlsPlayer lastEventIsAction lastEventNotFinalized',
                      actions: {
                        type: 'forwardToServer',
                      },
                      reenter: false,
                    },
                  },
                },
              },
              always: {
                target: 'Waiting',
                guard: 'userNotOnActiveSide',
              },
            },
          },
          on: {
            'rollback game event': {
              target: 'Gameloop',
              guard: 'isAdmin',
              actions: {
                type: 'forwardToServer',
              },
              reenter: false,
            },
            'switch sides': {
              target: 'Gameloop',
              guard: 'isAdmin',
              actions: {
                type: 'forwardToServer',
              },
              reenter: false,
            },
            'apply game event': {
              target: 'Gameloop',
              guard: 'isValidGameEvent',
              actions: {
                type: 'forwardToServer',
              },
              reenter: false,
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
                },
              },
            },
            Dismissed: {
              on: {
                'new global attack': {
                  target: 'Showing current global attack',
                },
                'show global attack': {
                  target: 'Showing current global attack',
                },
              },
            },
          },
        },
      },
      always: {
        target: 'Finished',
        guard: 'gameFinished',
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
      },
      reenter: false,
    },
    'send emoji': {
      target: '#gameClient',
      actions: {
        type: 'forwardToServer',
      },
      reenter: false,
    },
    'show emoji': {
      target: '#gameClient',
      actions: {
        type: 'showEmoji',
      },
      reenter: false,
    },
  },
})
