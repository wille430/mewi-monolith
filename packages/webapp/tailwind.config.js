const defaultConfig = require('@wille430/ui/tailwind.config')

Object.assign(defaultConfig, {
    content: ['./src/**/*.{ts,tsx}'],
    plugins: [require('tailwind-scrollbar')],
    theme: {
        extend: {
            ...defaultConfig.theme.extend,
            maxWidth: {
                'xxs': '18rem'
            }
        }
    },
    important: true,
})

module.exports = defaultConfig
