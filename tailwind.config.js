
module.exports = {
  content: [
    './packages/webapp/src/**/*.{html,js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          light: '#3D6E8F',
          DEFAULT: '#253C4C',
          dark: '#142D3F'
        },
        green: {
          light: '#8FE8A5',
          DEFAULT: '#4CEB74',
          dark: '#3CCC5C'
        },
        primary: '#253C4C',
        secondary: '#4CEB74'
      },
      gridTemplateColumns: {
        'fit-12': 'repeat(auto-fit, minmax(12rem, 1fr))'
      },
      fontFamily: {
        'sans': ['Inter']
      }
    },

  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
  mode: 'jit'
}
