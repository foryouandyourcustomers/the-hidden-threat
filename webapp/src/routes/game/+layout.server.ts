import shortUuid from 'short-uuid'

export const load = ({ cookies }) => {
  let playerId = cookies.get('playerId')
  if (!playerId) {
    playerId = shortUuid.generate()
  }
  cookies.set('playerId', playerId, {
    path: '/',
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
  })

  return {
    /**
     * Every client (browser) gets assigned a random playerId
     * that is stored in a cookie. This identifies the player
     * for each game.
     */
    playerId,
  }
}
