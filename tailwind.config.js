const colors = require("tailwindcss/colors");

const brandGreen = {
  100: "#caf41a",
  200: "#bfea0b",
  300: "#b0d80a",
  400: "#a0c509",
  500: "#91B208",
  600: "#829f07",
  700: "#728c06",
  800: "#637a05",
  900: "#546705",
};

const brandBlack = {
  100: "#bfcadb",
  200: "#828fa1",
  300: "#657182",
  400: "#4b5666",
  500: "#353d4a",
  600: "#272f3b",
  700: "#1b2029",
  800: "#14181f",
  900: "#080a0d",
};

module.exports = {
  purge: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./web/public/template.html",
    "./web/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "Arial", "Segoe UI", "sans-serif"],
        mono: [
          "Roboto Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },

      colors: {
        transparent: "transparent",
        primary: colors.cyan,
        accent: brandGreen,
        danger: colors.red,
        success: colors.lime,
        "bg-dark": brandBlack[900],
        "bg-light": brandBlack[100],
        "t-main": brandBlack[100],
        "t-sub": brandBlack[300],
        "b-light": brandBlack[500],
        "b-dark": brandBlack[300],
        "b-highlight": colors.cyan[300],
        "input-focus": brandBlack[700],
        "input-blur": brandBlack[600],
      },

      borderWidth: ["hover", "focus"],

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
