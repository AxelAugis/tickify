/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./assets/**/*.js",
    "./templates/**/*.html.twig",
  ],
  theme: {
    extend: {
      boxShadow: {
        'default': '10px 24px 24px #0000000F',
      },
      colors: {
        'layout': {
          'light': '#F3F3F3',
          'dark': '#121212',
        },
        'primary': '#333333',
        'outline': '#1bd2c6',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

