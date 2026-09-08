import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        duo: {
          green: "#58CC02",
          greenDark: "#58A700",
          blue: "#1CB0F6",
          blueDark: "#1899D6",
          gold: "#FFC800",
          red: "#FF4B4B",
          redDark: "#EA2B2B",
          purple: "#CE82FF",
          gray: "#E5E5E5",
          grayDark: "#AFAFAF",
          text: "#3C3C3C",
          nightBg: "#131f24",
          nightPanel: "#1f2c34",
          nightBorder: "#37464f",
          nightText: "#d7dfe3",
        },
      },
      fontFamily: {
        display: ['"Baloo 2"', '"Nunito"', "sans-serif"],
        body: ['"Nunito"', "sans-serif"],
      },
      borderRadius: { duo: "16px" },
    },
  },
  plugins: [],
};
export default config;