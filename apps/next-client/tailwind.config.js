module.exports = {
    content: [
        "./src/app/**/*.{jsx,tsx}",
        "./src/components/**/*.{jsx,tsx}",
    ],
    plugins: [require('tailwind-scrollbar')],
    mode: "jit",
    theme: {
        extend: {
            colors: {
                blue: {
                    light: '#3D6E8F',
                    DEFAULT: '#253C4C',
                    dark: '#142D3F',
                },
                green: {
                    light: '#8FE8A5',
                    DEFAULT: '#4CEB74',
                    dark: '#3CCC5C',
                },
                primary: '#253C4C',
                secondary: '#4CEB74',
                paper: '#ffffff',
                error: '#cc0000',
                muted: '#6b6b6b',
                google: {
                    blue: '#4285F4',
                    red: '#DB4437'
                }
            },
            screens: {
                xs: "540px"
            },
            gridTemplateColumns: {
                'fit-12': 'repeat(auto-fit, minmax(12rem, 1fr))',
            },
            fontFamily: {
                sans: ['Inter'],
            },
            maxWidth: {
                'xxs': '18rem'
            }
        }
    },
    important: true,
}
