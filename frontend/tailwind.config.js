/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundSize: {
        "200%": "200%",
      },
      animation: {
        shine: "shine 2s ease infinite",
      },
      keyframes: {
        shine: {
          "0%": {
            "background-position-x": "right 90%",
          },
          "50%": {
            opacity: "0.8",
          },
          "100%": {
            "background-position-x": "left -110%",
          },
        },
      },

      colors: {
        whatsapp: "rgb(0, 168, 132)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
