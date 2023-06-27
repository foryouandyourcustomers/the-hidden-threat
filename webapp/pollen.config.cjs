const { defineConfig } = require('pollen-css/utils')

module.exports = defineConfig((pollen) => {
  const containerWidths = {
    ...pollen.width,
    xl: '1128px',
    'content-max': `var(--width-xl)`,
  }

  const remSizes = Object.fromEntries(
    Object.entries(pollen.size)
      .filter(([key]) => `${parseInt(key)}` === key)
      .map(([key]) => [key, `${key / 4}rem`]),
  )

  return {
    output: 'src/lib/style/pollen.css',
    modules: {
      width: containerWidths,
      size: {
        ...pollen.size,
        ...remSizes,
        px: '0.0625rem',
      },
      radius: {
        ...pollen.radius,
        xs: `${3 / 16}rem`,
        sm: `${6 / 16}rem`,
        md: `${8 / 16}rem`,
        lg: `${12 / 16}rem`,
        xl: `${16 / 16}rem`,
      },
    },
  }
})
