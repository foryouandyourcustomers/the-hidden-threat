import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

export default {
  input: './tools/prod-server.ts',
  output: {
    dir: 'build',
    format: 'es',
  },
  plugins: [typescript(), nodeResolve(), commonjs()],
}
