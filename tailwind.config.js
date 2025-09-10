/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'poker-green': '#0F5132',
        'poker-red': '#DC2626',
        'poker-gold': '#D97706',
      }
    },
  },
  plugins: [],
}