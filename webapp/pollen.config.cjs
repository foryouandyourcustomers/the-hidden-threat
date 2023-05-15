const { defineConfig } = require('pollen-css/utils')

module.exports = defineConfig((pollen) => {
  const containerWidths = {
    ...pollen.width,
    xl: '1128px',
    'content-max': `var(--width-xl)`,
  }
  return {
    output: 'src/lib/style/pollen.css',
    modules: {
      width: containerWidths,
    },
  }
})
