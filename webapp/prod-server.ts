import * as path from 'path'
import * as url from 'url'
import { createGlobalWebSocketServer } from './src/lib/server/web-socket/global-server'
import { upgradeHttpConnection } from './src/lib/server/web-socket/upgrade-connection'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

createGlobalWebSocketServer()

const { server } = await import(path.resolve(__dirname, './build/index.js'))
server.server.on('upgrade', upgradeHttpConnection)
