/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/js/*.js", "./conf/templates/miniCSS/**/*.html"],
  theme: {
      extend: {
	  order: {
              '23': '23',
              '21': '21',
              '20': '20',
              '19': '19',
              '18': '18',
              '17': '17',
              '16': '16',
              '15': '15',
              '14': '14',
              '13': '13',
              '12': '12',
              '11': '11'
	  }
      },
    screens: {
      'xs': '480px',
      // => @media (min-width: 480px) { ... }
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @mediba (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    }
  },
  plugins: [],
}
