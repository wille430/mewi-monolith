const defaultConfig = require('@wille430/ui/tailwind.config')

Object.assign(defaultConfig, {
    content: ['./src/**/*.{ts,tsx}'],
    plugins: [require('tailwind-scrollbar')],
    important: true,
})

module.exports = defaultConfig
