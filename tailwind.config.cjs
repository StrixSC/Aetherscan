/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
    extend: {
      colors: {
        "headline-light-gray": '#CFD5E2',
        "headline-gray": '#6F7277',
        "headline-navy": '#161B25',
        "key-blue": '#1755E7',
        "key-white": '#F0F2F5',
        "key-light-gray": '#C3CDD9',
        "process-green": '#02C94F',
        "process-orange": '#FF7E07',
        "process-yellow": '#FFCD1C',
        "process-red": '#F33B12',
      },
    },
    darkMode: 'class',
    plugins: []
  }
}