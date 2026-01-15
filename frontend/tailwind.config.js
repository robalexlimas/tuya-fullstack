/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tuya: {
          red: "#ED1C29",

          black: "#201513",
          white: "#FFFFFF",
          gray: "#F3F0F0",

          yellow: {
            DEFAULT: "#FFE800",
            soft: "#FFDB00",
          },

          orange: {
            light: "#FF9F00",
            DEFAULT: "#F39C3B",
            dark: "#FFA900",
          },

          green: {
            DEFAULT: "#9CCB49",
            light: "#B7D433",
          },

          teal: {
            DEFAULT: "#77C3CD",
            light: "#9ED4DC",
          },
        },
      },
    },
  },
  plugins: [],
};
