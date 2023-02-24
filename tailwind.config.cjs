/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'window': 'canvas',
      },
      opacity: {
        '80': '0.8',
      },
    },
  },
  plugins: [],
}
