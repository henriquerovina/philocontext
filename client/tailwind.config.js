export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: '#fdf2f3',
          100: '#f9d6d8',
          200: '#f3adb3',
          300: '#ed848e',
          400: '#e75b68',
          500: '#d32f3f',
          600: '#a72633',
          700: '#83151D',
          800: '#5c0f14',
          900: '#35080c',
        },
        gray: {
          50: '#f5f5f5',
          100: '#e6e6e6',
          200: '#cccccc',
          300: '#b3b3b3',
          400: '#999999',
          500: '#808285',
          600: '#666666',
          700: '#4d4d4d',
          800: '#333333',
          900: '#1a1a1a',
        },
        gold: {
          50: '#fff8e6',
          100: '#ffedb3',
          500: '#FFB71B',
          700: '#d99a00',
        },
        blue: {
          500: '#00838F',
          700: '#005a63',
        },
        plum: {
          500: '#733975',
          700: '#4d264e',
        },
      },
      fontFamily: { serif: ['Georgia', 'serif'], sans: ['Inter', 'system-ui', 'sans-serif'] },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
        'pulse-dot': 'pulseDot 1.4s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseDot: { '0%,80%,100%': { transform: 'scale(0.6)' }, '40%': { transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
};
