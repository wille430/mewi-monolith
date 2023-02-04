
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx}",
        "./src/lib/components/**/*.{js,ts,jsx,tsx}",
    ],
    plugins: [require('tailwind-scrollbar')],
    purge: true,
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
