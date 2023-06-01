import { assign, fromPromise } from 'xstate'
import { machine } from './machine'
import type { ServerEventOf } from './types'
import { sendMessageToPlayers } from '$lib/server/web-socket/game-communication'

export const serverGameMachine = machine.provide({
  actions: {
    consoleLogValue: ({ event }) => {
      console.log(event)
    },
    consoleLogValueAgain: ({ context }) => {
      console.log('context value 2: ', context)
    },

    updatePlayerConnectionState: assign(({ context, event: e }) => {
      const event = e as ServerEventOf<
        'player connected' | 'player reconnected' | 'player disconnected'
      >

      const existingPlayer = context.players.find((player) => player.id === event.playerId)
      if (existingPlayer) {
        existingPlayer.isConnected =
          event.type === 'player connected' || event.type === 'player reconnected'
        return {
          players: [...context.players],
        }
      } else {
        console.warn('Got a connection update for a player that has not joined', event.playerId)
        return {}
      }
    }),
    storeNewPlayer: assign(({ context, event: e }) => {
      const event = e as ServerEventOf<'player joined'>

      const existingPlayer = context.players.find((player) => player.id === event.playerId)
      if (!existingPlayer) {
        return {
          players: [
            ...context.players,
            { id: event.playerId, name: event.playerName, isConnected: false },
          ],
        }
      } else {
        console.warn('Player already joined', event.playerId)
        return {}
      }
    }),
    sendPlayersUpdate: ({ context }) => {
      sendMessageToPlayers({
        gameId: context.gameId,
        message: {
          type: 'players update',
          players: context.players.map(({ id, name, isConnected }) => ({ id, name, isConnected })),
        },
      })
    },
    sendEmojiToOtherPlayers: ({ context, event: e }) => {
      const event = e as ServerEventOf<'send emoji'>
      sendMessageToPlayers({
        gameId: context.gameId,
        message: {
          type: 'show emoji',
          emoji: event.emoji,
          playerId: event.playerId,
        },
        excludePlayerIds: [event.playerId],
      })
    },
  },
  guards: {
    allPlayersJoined: () => false,
    notAllPlayersJoined: () => false,
  },
  actors: {
    loadParticipants: fromPromise(async () => {
      console.log('loading')
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return ['a', 'b']
    }),
  },
})
