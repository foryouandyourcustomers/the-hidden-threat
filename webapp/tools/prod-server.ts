// This file will be bundled with rollup, and be put in the build/ directory.
// Then inside this directory, the app can be run with `npm run start`

import * as path from 'path'
import * as url from 'url'
import { createGlobalWebSocketServer } from '../src/lib/server/web-socket/global-server'
import { upgradeHttpConnection } from '../src/lib/server/web-socket/upgrade-connection'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

createGlobalWebSocketServer()

const { server } = await import(path.resolve(__dirname, './index.js'))
server.server.on('upgrade', upgradeHttpConnection)
