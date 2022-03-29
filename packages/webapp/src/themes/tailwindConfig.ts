// import tailwindConfig from '../../tailwind.config'
import resolveConfig from 'tailwindcss/resolveConfig'
import { TailwindThemeValue } from 'tailwindcss/tailwind-config'

const config = resolveConfig({
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
                primary: '#253C4C',
                secondary: '#4CEB74',
            },
            gridTemplateColumns: {
                'fit-12': 'repeat(auto-fit, minmax(12rem, 1fr))',
            },
            fontFamily: {
                sans: ['Inter'],
            },
        },
    },
    plugins: [],
})
export default config

export const screens = config.theme.screens as TailwindThemeValue as Record<string, string>
