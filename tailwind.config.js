/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      colors: {
        "headline-light-gray": "#CFD5E2",
        "headline-gray": "#6F7277",
        "headline-navy": "#161B25",
        "key-blue": "#1755E7",
        "key-white": "#F0F2F5",
        "key-light-gray": "#C3CDD9",
        "process-green": "#02C94F",
        "process-orange": "#FF7E07",
        "process-yellow": "#FFCD1C",
        "process-red": "#F33B12",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    themes: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "dz",
    darkTheme: "dark",
  },
};
