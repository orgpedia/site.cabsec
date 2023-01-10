/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["site/script/*.js", "./conf/miniCSSTemplates/**/*.html"],
  theme: {
      extend: {
	  order: {
              '19': '19',	      
              '17': '17',
              '15': '15',
              '13': '13',
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
