import shortUuid from 'short-uuid'

export const load = ({ cookies }) => {
  let userId = cookies.get('userId')
  if (!userId) {
    userId = shortUuid.generate()
  }
  cookies.set('userId', userId, {
    path: '/',
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
  })

  return {
    /**
     * Every client (browser) gets assigned a random userId
     * that is stored in a cookie. This identifies the user
     * for each game.
     */
    userId,
  }
}
