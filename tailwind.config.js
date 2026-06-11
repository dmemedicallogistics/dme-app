/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Refined brand red — deeper, less saturated than default Tailwind red.
        // Remapped so every existing `red-*` class site-wide picks up the new brand.
        red: {
          50: '#FBF5F4',
          100: '#F7E7E5',
          200: '#EFCEC9',
          300: '#E0A9A1',
          400: '#CE7C72',
          500: '#BA5347',
          600: '#A93527',
          700: '#8C2B20',
          800: '#73271E',
          900: '#5F231C',
          950: '#34110C',
        },
        cream: '#FAF8F6',
        ink: '#211D1A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 16px -4px rgb(33 29 26 / 0.08)',
        lift: '0 12px 32px -12px rgb(33 29 26 / 0.18)',
      },
    },
  },
  plugins: [],
};
