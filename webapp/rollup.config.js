import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import copy from 'rollup-plugin-copy'

export default {
  input: './tools/prod-server.ts',
  output: {
    dir: 'build',
    format: 'es',
  },
  plugins: [
    typescript(),
    nodeResolve(),
    commonjs(),
    copy({
      targets: [
        { src: './tools/build-package.json', dest: './build', rename: 'package.json' },
        { src: './tools/pm2.config.cjs', dest: './build' },
      ],
    }),
  ],
}
