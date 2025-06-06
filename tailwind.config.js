/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'], 
  theme: {
    extend: {
      fontFamily: {
        garamond: ['"EB Garamond"', 'serif'],
        inter: ['"Inter"', 'serif']
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
