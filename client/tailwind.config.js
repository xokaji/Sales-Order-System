/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#14213D",
          700: "#28374F",
          500: "#4A5568",
        },
        paper: "#F5F7F9",
        surface: "#FFFFFF",
        line: "#DCE2E8",
        accent: {
          DEFAULT: "#0F6D66",
          soft: "#E4F0EE",
          hover: "#0B544F",
        },
        danger: "#B4432F",
      },
      fontFamily: {
        display: ["Space Grotesk", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(20, 33, 61, 0.06), 0 1px 12px rgba(20, 33, 61, 0.04)",
      },
    },
  },
  plugins: [],
}
