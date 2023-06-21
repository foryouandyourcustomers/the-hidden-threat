import { createMachine } from 'xstate'
import type { Context, ServerEvent, ServerUser } from './types'

export const machine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswGUwCcBuuAxAK6y4AEAxgPYB2tYlALpANoAMAuoqAA7WwAlk0F0eIAB6IAjO2kBOAHQKAbAHY1AJhWaAzGvaaALABoQATxmbFR6WpXTpm+cfUAON5oC+Xs6gzY+ESkFDiMdAzMbFzi-EIiYkiSiAYArMpuKqnyCrqaWpqpZpYImuyK8qm6eexybqmOank+fuhYuAQ4JGQ45BCCsDT0jCwQHNxJccKitOJSCLrybopuRjpuuuxaRvI5xYj6FZVu9sZbqVkqLSD+7UFdZLQQ5GBo1ABWguOxAtOJoPNHOlpNlUm4crojFD7Lp9ggHIo1PJFrpVh5appVtdboFOooAHLUJjkWBMFA4UbdCjvaiCBhjGKTX4JWZJebaIzKRYKHZudj6IzsUwWRDZFSKfnsFwqeQ7Sog7FtXG4AlEklkimQRQAQVgQigtDpUHIIRwsEI3yZ8RmcwOTUUujsBiMG0MKjc0hUcKMDQqUry2l06guV18NyVHRVhOJpPJo0UACUwCgIOZyExqOq44QABYCGMapiwci3S18Zk2tkpVZHJa2XlrTTe7SKVI7FSOj3SaoqUNh2jUCBwcQ4yM4H7W-7JBbpcF8sqohQXdhekWlIxqRQcjvI1HHFeKgJj1UFuOQCd-VkAxAbFZLQz8j2VFQruFB6zyKVQ+Q6VL8tRQoedx4tGWaahAOp6oIBpGiaPTwFal62gg3bSHe86PkuL6riUPrlIKLiVBcqSpJohRAcqOAnmB8ZJimaYZjRF4sshqT2qsagepskKcdo3p-jYUr5A42TomoFHHgA4m05CYIW56ISxVYobU5RqNInikQoxicbCa7VJy9hVPk-LumsEn3Io0kYLJ8kQQAkoaIgoAANsxlbXipLqIhphSaNpG4bN6Mpblk6mGIU8haOoPg+EAA */

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

  initial: 'Not started',

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
            'host starts game': {
              actions: 'consoleLogValue',
              target: '#gameServer.Game Started',
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
    'user connected': {
      actions: ['updateUserConnectionState', 'sendUsersUpdate'],
      target: '#gameServer',
    },

    'user reconnected': {
      actions: ['updateUserConnectionState', 'sendUsersUpdate'],
      target: '#gameServer',
    },

    'user disconnected': {
      actions: ['updateUserConnectionState', 'sendUsersUpdate'],
      target: '#gameServer',
    },

    'send emoji': {
      target: '#gameServer',
      actions: 'sendEmojiToOtherUsers',
    },
  },
})
