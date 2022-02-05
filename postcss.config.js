const { join } = require('path')

module.exports = {
    syntax: 'postcss-scss',
    plugins: {
        tailwindcss: { config: join(__dirname, 'tailwind.config.js') },
        autoprefixer: {},
        'postcss-modules-values': {},
    },
}
