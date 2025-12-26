/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#006D77',
        accent: '#83C5BE',
        dark1: '#0B132B',
        dark2: '#1C2541',
        neutral: '#C5C6C7'
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['Lato', 'Nunito Sans', 'sans-serif']
      }
    }
  },
  plugins: []
};