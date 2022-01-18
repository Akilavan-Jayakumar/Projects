module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navyblue: {
          50: "#ece1f7",
          100: "#d7c5ef",
          200: "#b9a5e4",
          300: "#9986d7",
          400: "#766ac7",
          500: "#5350b3",
          600: "#39409c",
          700: "#253481",
          800: "#152962",
          900: "#091e42",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp"), require("@tailwindcss/forms")],
};
