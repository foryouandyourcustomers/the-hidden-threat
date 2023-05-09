import { sveltekit } from '@sveltejs/kit/vite'
import { createGlobalWebSocketServer } from './src/lib/server/web-socket/global-server'
import { upgradeHttpConnection } from './src/lib/server/web-socket/upgrade-connection'

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [
    sveltekit(),
    {
      name: 'integratedWebsocketServer',
      configureServer(server) {
        createGlobalWebSocketServer()
        server.httpServer?.on('upgrade', upgradeHttpConnection)
      },
    },
  ],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
}

export default config
