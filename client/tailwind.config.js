export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        court: {
          50: "#f0fdf8",
          100: "#d8fbe8",
          200: "#b1f4d4",
          300: "#7be7b7",
          400: "#3fd18c",
          500: "#19b06f",
          600: "#0f8d5a",
          700: "#0f7048",
          800: "#10583b",
          900: "#0f4833"
        },
        clay: "#d96d3a",
        navy: "#09111f"
      },
      boxShadow: {
        card: "0 24px 60px rgba(9,17,31,0.18)"
      }
    }
  },
  plugins: []
};
