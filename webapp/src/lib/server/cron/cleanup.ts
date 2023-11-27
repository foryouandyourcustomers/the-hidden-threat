import { objectEntries } from '$lib/utils'
import { ActorStatus } from 'xstate'
import { deleteGame, getGames } from '../game/global'

const MAX_GAME_DAYS = 14

export const cleanupGames = () => {
  const allGames = getGames()

  objectEntries(allGames).forEach(([gameId, game]) => {
    if (
      // Delete all stopped machines. There's no need to keep them around.
      game.machine.status === ActorStatus.Stopped ||
      // The game is older than MAX_GAME_DAYS so let's delete it.
      game.machine.getSnapshot().context.timestamp <
        Date.now() - 1000 * 60 * 60 * 24 * MAX_GAME_DAYS
    ) {
      deleteGame(gameId)
    }
  })
}
