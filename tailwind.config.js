/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        divine: {
          black: '#0a0a0f',
          dark: '#12121a',
          darker: '#0d0d14',
          purple: {
            50: '#f5f0ff',
            100: '#e9deff',
            200: '#d4bfff',
            300: '#b794ff',
            400: '#9e6aff',
            500: '#8b47ff',
            600: '#7c2aff',
            700: '#6619e6',
            800: '#5315b8',
            900: '#2a0a4d',
          },
          gold: {
            50: '#fffef7',
            100: '#fff9e0',
            200: '#fff3c4',
            300: '#ffe699',
            400: '#ffd54d',
            500: '#e6b800',
            600: '#c9a000',
            700: '#a67c00',
            800: '#856300',
            900: '#5c4500',
          },
        },
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        body: ['Cormorant Garamond', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(139, 71, 255, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(230, 184, 0, 0.5)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
