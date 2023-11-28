const postcssPresetEnv = require('postcss-preset-env')
const cssnano = require('cssnano')

const mode = process.env.NODE_ENV
const dev = mode === 'development'

module.exports = {
  map: false,
  plugins: [
    postcssPresetEnv({
      stage: 2,
      features: {
        'nesting-rules': true,
        'cascade-layers': false,
      },
    }),
    !dev &&
      cssnano({
        preset: 'default',
      }),
  ],
}
