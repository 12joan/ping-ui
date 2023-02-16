/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'window': 'rgb(30, 30, 30)',
        'input': 'rgb(37, 37, 37)',
        'input-focus': 'rgb(27, 27, 27)',
        'button': 'rgb(41, 41, 41)',
        'button-hover': 'rgb(50, 50, 50)',
        'ui-text': 'rgb(123, 123, 123)',
        'accent': 'rgb(240, 160, 60)',
      },
    },
  },
  plugins: [],
}
