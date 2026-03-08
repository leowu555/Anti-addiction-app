/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#22d3ee',
          dark: '#06b6d4',
        },
        accent: '#a855f7',
      },
      animation: {
        'modal-in': 'modalIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'breathe-in': 'breatheIn 2.5s ease-out forwards',
        'screen-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        modalIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        breatheIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
