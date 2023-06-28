import { createMachine } from 'xstate'
import type { Context, ServerEvent, ServerUser } from './types'

export const machine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswGUwCcBuuAdAOLpiEByA9gC4AEsNKONkAxAK6y50BWVASwB2kANoAGALqJQAByqwBNAVSEyQAD0QAWcQHZCATgCMegKxmAHMe17D4gEwBmMwBoQAT0QPxZwmYdbYwdLPXFrcWMAXyj3VAxsfCJSDEpaBiYWdhRYRSghBgEIMAlpJBB5RWVVdS0EY2DCADYHJsNdJuN9Yxa3T0RjSycjH1CnTsMHQya9PRi4skSCHBIyNPpGZlYIQgBBXIF84Sg6LlxYNlL1SqUVNXK6p1NCB0GwmzMnQ0NLX3cvBCfYZmFq2PQNMImeYgeJYXDLVapagbTLbQgAJTAKAgHjoNCoGS2bE2LAYYBoHFkV3KN2q91AdSaTmGX18nWZ5icDn+iE+DkI4lBsyc4m02hBTmhsKWyTW2ApsjYOTyBRwVAANiUpNcFLcag9EJYmn4fD0nHofE1tJ1jDyEA49NoXg1vjYnlZLJZtFLFvDZal5ZS9gcjkITmrNRdqXJdXTaogfsZmlymsbpmLxrb+oDtEmQYFZhDxFDYjDfUkVilyIHZHt1eq6BG4HRlYcRBA2AAzYQCWAACzJCujFVjd3j9TZhEsrS+IJBTKcdrC-LaQ2Nn0s9mnPoSfsrawA8jhijhB5TieS6LJ1SgPDwqMfcMPaWODfaQc0hp8Ol6Ha07b8hiELMthWi4gximYO5whWiLkEeJ5noqJL0LCz6jvqDIDJ6zRirouZNJuuainaXTmIQ2j2NalEguChiSqW0p7oQgAU5HQACqABGAgAI4cEoVBcBeQgQHQYBoFQvACOhVSvlhCAALRhOIwG-EyxhmD81gWHaxoGJMxb0aK2hegxCy7rBbFcbx-H4kJZynhAvYAMaqCIznbDJer0poiAKdawzGo4Qx6ByrQ9LpISED0nrik4XpeqY0EyisVncXxAn2dwp44GArlCO5nnajSGE+XUCnxYFATtGKIS+EadrxUmxY+OB9GGGY4iislzFpTZmUXA5dD5YVYjFTGsmYb5ikNOE-jmrMTSCgEFp6HaZhhFO7xhFyxiGBa3qMeWCJVnBdCYKi7BeXGb4NI09GDEam6xT8pEaUmppGp1GmehYPWwadVbnZdHYRuqnEoM5ADWdCwi2Hl3NdcnTQ4VgUWEuaaV8DqdYu2bGMySYdSZ2iozRvhzEdFknWsQMXVs7BgBoeUcKwsNkPDdJI1NdSo5Y6Oihp7U46RnVOp1egtJaXp2AxpZCFQxTwOUTEVjqk1lX5DQfp8syS8tf5rdm-MGUaHUafFMyzP9NMYOr3njlMdrTBRowWkRpP0ZT5kwbb5DIoSWQQPbN3yd8jXWAKvSQtY5qvDb-r++kKGQMGKrHKc2XKxNDu3bY61cv4oJWmYHShQn+5IsnIMYliOJ4gSKEh8jdS5vyIoBRYph2KEBf8vm1Gl4KFqGBXcFnfTQfNzzvIbQKWmhOT4jjKRhnRZRdiDMve0hGPp01tPmsIJL-PhFYGkBKmop4wCuj8-mTWfJEl973K5JBvs6dho2GpwIf47WCaAKSw58LCtCWtoG+vJdBF0CPYQU05ZyvwDO-Wsux6w-0jC2EM7Z-63X0EA8ERourBWcIRdaMCB6sgJl0JkyD4KPlPNwBUeD5KzAAvYKcwRxShQdA0L4Y8+oZTstnEcGtxwKUmIQ+K1oNrjFJqjO0tVCDmk3JMb83xwj0MIAAMR7P2SArDpoE1FNFV0xod5BDeq0F4kQTAOhcKTSwMQYhAA */

  id: 'gameServer',

  context: ({ input }: { input: { gameId: string; host: ServerUser } }) => ({
    gameId: input.gameId,
    hostUserId: input.host.id,
    // TODO: this should get popullated with players
    players: [],
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
            // {

            'user joined': {
              actions: ['storeNewUser', 'sendUsersUpdate'],
              target: 'Not started',
            },

            'assign side': {
              target: 'Not started',
              guard: 'isAdmin',
              actions: ['assignSide', 'sendUsersUpdate'],
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

          description: `The game is active and started. Now the server only waits for the game actions from the players.

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
            'set player order': {
              target: 'Order setup',
              guard: 'isAdmin',
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
