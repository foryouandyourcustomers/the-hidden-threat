import { assign, fromPromise } from 'xstate'
import { machine } from './machine'
import type { ServerEventOf } from './types'
import { sendMessageToUsers } from '$lib/server/web-socket/game-communication'

export const serverGameMachine = machine.provide({
  actions: {
    consoleLogValue: ({ event }) => {
      console.log(event)
    },
    consoleLogValueAgain: ({ context }) => {
      console.log('context value 2: ', context)
    },

    updateUserConnectionState: assign(({ context, event: e }) => {
      const event = e as ServerEventOf<'user connected' | 'user reconnected' | 'user disconnected'>

      const existingUser = context.users.find((user) => user.id === event.userId)
      if (existingUser) {
        existingUser.isConnected =
          event.type === 'user connected' || event.type === 'user reconnected'
        return {
          users: [...context.users],
        }
      } else {
        console.warn('Got a connection update for a user that has not joined', event.userId)
        return {}
      }
    }),
    storeNewUser: assign(({ context, event: e }) => {
      const event = e as ServerEventOf<'user joined'>

      const existingUser = context.users.find((user) => user.id === event.userId)
      if (!existingUser) {
        return {
          users: [
            ...context.users,
            { id: event.userId, name: event.userName, isAdmin: false, isConnected: false },
          ],
        }
      } else {
        console.warn('User already joined', event.userId)
        return {}
      }
    }),
    sendUsersUpdate: ({ context }) => {
      sendMessageToUsers({
        gameId: context.gameId,
        message: {
          type: 'users update',
          users: [...context.users],
        },
      })
    },
    sendEmojiToOtherUsers: ({ context, event: e }) => {
      const event = e as ServerEventOf<'send emoji'>
      sendMessageToUsers({
        gameId: context.gameId,
        message: {
          type: 'show emoji',
          emoji: event.emoji,
          userId: event.userId,
        },
        excludeUserIds: [event.userId],
      })
    },
    // TODO
    assignSide: () => ({}),
  },
  guards: {
    // TODO
    gameIsReadyToStart: () => false,
    // TODO
    isAdmin: () => false,
  },
  actors: {
    loadParticipants: fromPromise(async () => {
      console.log('loading')
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return ['a', 'b']
    }),
  },
})
