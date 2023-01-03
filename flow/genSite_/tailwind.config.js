/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./output/en/**/*.{html,js}", "./conf/templates/**/*.html", "./output/*.html", "./node_modules/tw-elements/dist/js/**/*.js"],
  theme: {
      extend: {
	  order: {
              '17': '17',
              '15': '15',
              '13': '13'
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
  plugins: [
    require('tw-elements/dist/plugin')
  ],
}
