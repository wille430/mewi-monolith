const { join } = require('path')

module.exports = {
    syntax: 'postcss-scss',
    plugins: {
        'postcss-import': {},
        tailwindcss: { config: join(__dirname, 'tailwind.config.js') },
        autoprefixer: {},
        'postcss-modules-values': {},
    },
}
