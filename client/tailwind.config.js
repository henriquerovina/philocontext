export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: { 50: '#faf8f6', 100: '#f5f2ed', 200: '#e8e2d8', 800: '#3a3530', 900: '#1c1a17' },
        ink: { 50: '#f0f2f5', 100: '#d9dce3', 800: '#2c303a', 900: '#14161c' },
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
