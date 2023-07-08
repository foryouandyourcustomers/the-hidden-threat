import { createMachine } from 'xstate'
import type { Context, ServerEvent, ServerUser } from './types'

export const machine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswGUwCcBuuAdAOLpiEByA9gC4AEsNKONkAxAK6y50BWVASwB2kANoAGALqJQAByqwBNAVSEyQAD0QAWcQHZCATgCMegKxmAHMe17D4gEwBmMwBoQAT0QPxZwmYdbYwdLPXFrcWMAXyj3VAxsfCJSDEpaBiYWdhRYRSghBgEIMAlpJBB5RWVVdS0EY2DCADYHJsNdJuN9Yxa3T0RjSycjH1CnTsMHQya9PRi4skSCHBIyNPpGZlYIQgBBXIF84Sg6LlxYNlL1SqUVNXK6p1NCB0GwmzMnQ0NLX3cvBCfYZmFq2PQNMImeYgeJYXDLVapagbTLbQgAJTAKAgHjoNCoGS2bE2LAYYBoHFkV3KN2q91AdSaTmGX18nWZ5icDn+iE+DkI4lBsyc4m02hBTmhsKWyTWKTAdEwqPYYA0YAAxhxWHRYXQUOq6dS5ApbjUHt4rIRbKLjGZDF8HOYefUzKL-PoWj4mpZbPapYt4bLUvLFcqIGwcFQADZRgBG+oA1jqyHqDXcjRUTXTahbLFawtpbfbJuZxE5ncZmcYjGZtD6HLXDK6zHNYjCA0kVvLEQqlVt2BnaXcc-UGvz7YNLN6fj6fhXbdWfIMmq7bZZLBZ-QlA121tgKbI2Dk8gVI1GSlJrlnh+aEFO-EumXovdpOsZnY7tC8Gt8bE8rOu2hbnCnY9oQ+6UnsBxHEIJxnnAlyXjS15mgyiA-NWTKtCu0xiuM779IChb+EK4KmOIUJttKO5gRBsh7DGdDwbAerQSI4YAGbCAIsAABZkgeg4ofSmgDGyhCWK0XwgiCTLloRYT8m0Qwrp8lj2JJwEyruqQAPI4MUOACZSxLknQshRigHg8FQBm4EJVQ3mhCCBHmQxctY6kti28kAnoTRNBJMy2AB4STFpNHdvphnGYeJL0LCDmmiJdSTs0Yq6IW06FqKFb6H42j2K+hUguCfpUR2CKABTkdAAKqxgIACOHBKFQXCmUIEB0GAaBULwAhJdmt4ALRhOIhB6L8TJFuutp9ACK4GJMFH2qKdbaJKFXbqBNX1U1LX4u1ZxGRAPHqqoIgGmISHGo5qGiQgw2vsMK6OEMegcq0PTOi0eY9IBanraYEU7XVDXNa1R3cEZOAahdGrbINTkPcNThDM0ATtGKIS+FOzpo9WFE+C4xjFq6oog9VYP7ZDFzHXQ51CJdiM3Zmd0pYgw0NOE-hOLM-mCgEz56M6LbjaEkRhFypPPkB0JCFQxTwOU1Gdle7MjlztqBZ8-NNILjqOs6ebLaEDbBIKZYhJTQZgOryUjlMzrTFaowfYLMwbk0Ns6eQyKElkED20NznfPj1gCqCG0Ba94Q+2B-vxZAUEnscpzQ8rt0O7eNgi4RfIkYETTih0H3x92idhhiWI4niBLxcHyN1IW-Iis9FimHYoSi1yhfFbWgrPoY5dyimfaB43911BYBgUeuoQleIZZNHl3yEDYhh2IMZak9bW0gQi3Z0ZPHMIP5ebhFYc3YaKvk6DzILOCYTbMhuNgj6kdEp4cQhp8xJ8jmsIFS+1gLA3w2qLXQfd7CCkktJD+5Av67EYsxViJ5IAAJzh6Cay4l5vWcN6SB41H4bXsJWLoTIEGEGijwbgB5MHOVmMbewElgjig+o6BoXwqEADFuJ8QwchDWOc27r1-CuXeQR5ytBeJEEwjoXDaD3gsbaVM9oQ0OpnNm2dnLDUmIFD6PpFrjCUQ2Z02NCB83UpMT4hUNIxBiEAA */

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
              actions: 'storePlayerOrder',
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
