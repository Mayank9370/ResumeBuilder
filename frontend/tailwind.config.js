/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Sans Serif
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        opensans: ['"Open Sans"', 'sans-serif'],
        lato: ['Lato', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        raleway: ['Raleway', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
        source: ['"Source Sans 3"', 'sans-serif'],
        ubuntu: ['Ubuntu', 'sans-serif'],
        work: ['"Work Sans"', 'sans-serif'],
        fira: ['"Fira Sans"', 'sans-serif'],
        quicksand: ['Quicksand', 'sans-serif'],
        barlow: ['Barlow', 'sans-serif'],
        mulish: ['Mulish', 'sans-serif'],
        titillium: ['"Titillium Web"', 'sans-serif'],
        dm: ['"DM Sans"', 'sans-serif'],
        heebo: ['Heebo', 'sans-serif'],
        josefin: ['"Josefin Sans"', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
        cairo: ['Cairo', 'sans-serif'],
        oxygen: ['Oxygen', 'sans-serif'],
        hind: ['Hind', 'sans-serif'],
        karla: ['Karla', 'sans-serif'],
        signika: ['Signika', 'sans-serif'],
        cabin: ['Cabin', 'sans-serif'],
        catamaran: ['Catamaran', 'sans-serif'],
        asap: ['Asap', 'sans-serif'],
        varela: ['"Varela Round"', 'sans-serif'],
        
        // Serif
        serif: ['Merriweather', 'ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        merriweather: ['Merriweather', 'serif'],
        playfair: ['"Playfair Display"', 'serif'],
        garamond: ['"EB Garamond"', 'serif'],
        ptserif: ['"PT Serif"', 'serif'],
        crimson: ['"Crimson Text"', 'serif'],
        lora: ['Lora', 'serif'],
        librebaskerville: ['"Libre Baskerville"', 'serif'],
        arvo: ['Arvo', 'serif'],
        bitter: ['Bitter', 'serif'],
        
        // Mono
        mono: ['Inconsolata', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
        inconsolata: ['Inconsolata', 'monospace'],
        
        // Display / Modern
        oswald: ['Oswald', 'sans-serif'],
        anton: ['Anton', 'sans-serif'],
        teko: ['Teko', 'sans-serif'],
        fjalla: ['"Fjalla One"', 'sans-serif'],
      },
      safelist: [
        {
          pattern: /^font-/,
        },
      ],
      colors: {
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
      },
    },
  },
  plugins: [],
}
