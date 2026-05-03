/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        page: '#0a0a0f',
        card: '#13131a',
        cardalt: '#1a1a2e',
        accent: '#2B97C7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(43, 151, 199, 0.45)',
      },
    },
  },
  plugins: [],
};
