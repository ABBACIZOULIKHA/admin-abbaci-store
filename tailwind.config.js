/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        Poppins: "Poppins",
      },
      colors: {
        clay: "#CB997E",
        sand: "#DDBEA9",
        ivory: "#FFE8D6",
        stone: "#B7B7A4",
        sage: "#A5A58D",
        olive: "#6B705C",
      },
    },
  },
  plugins: [],
};
