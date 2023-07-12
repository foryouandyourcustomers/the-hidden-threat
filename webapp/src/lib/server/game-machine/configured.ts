import { assign, fromPromise } from 'xstate'
import { machine } from './machine'
import type { ServerEventOf } from './types'
import { sendMessageToUsers } from '$lib/server/web-socket/game-communication'
import { produce, setAutoFreeze } from 'immer'
import { getUserIndex } from './utils'

setAutoFreeze(false)

export const serverGameMachine = machine.provide({
  actions: {
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
    assignSide: assign(({ context, event: e }) => {
      const event = e as ServerEventOf<'assign side'>

      const userIndex = getUserIndex(context, event.otherUserId)
      if (userIndex === undefined) return {}

      return {
        users: produce(context.users, (users) => {
          users[userIndex].side = event.side
        }),
      }
    }),
    assignAdmin: assign(({ context, event: e }) => {
      const event = e as ServerEventOf<'assign admin'>

      const userIndex = getUserIndex(context, event.otherUserId)
      if (userIndex === undefined) return {}

      return {
        users: produce(context.users, (users) => {
          users[userIndex].isAdmin = event.isAdmin
        }),
      }
    }),
  },
  guards: {
    // TODO
    gameIsReadyToStart: () => false,
    // TODO
    isAdmin: ({ context, event }) =>
      context.users.find((user) => user.id === event.userId)?.isAdmin ?? false,
  },
  actors: {
    loadParticipants: fromPromise(async () => {
      // This is just a placeholder for any actual actors we might need in the
      // future.
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return ['a', 'b']
    }),
  },
})
