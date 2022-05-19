module.exports = {
    content: ['./src/**/*.{ts,tsx}'],
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
                gray: {
                    150: 'rgb(235, 237, 240)',
                },
                primary: '#253C4C',
                secondary: '#4CEB74',
                paper: 'hsl(0, 100%, 99%)',
            },
            gridTemplateColumns: {
                'fit-12': 'repeat(auto-fit, minmax(12rem, 1fr))',
            },
            fontFamily: {
                sans: ['Inter'],
            },
        },
    },
    plugins: [require('tailwind-scrollbar')],
    important: true,
}
