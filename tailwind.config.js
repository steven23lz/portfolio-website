/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["Geist Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        pixel: ["Geist Pixel", "Geist Mono", "ui-monospace", "monospace"],
        serif: ["Source Serif 4", "Georgia", "Times New Roman", "serif"],
      },
      colors: {
        white: "rgb(var(--bg) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        gray: {
          50: "rgb(var(--g50) / <alpha-value>)",
          100: "rgb(var(--g100) / <alpha-value>)",
          200: "rgb(var(--g200) / <alpha-value>)",
          300: "rgb(var(--g300) / <alpha-value>)",
          400: "rgb(var(--g400) / <alpha-value>)",
          500: "rgb(var(--g500) / <alpha-value>)",
          600: "rgb(var(--g600) / <alpha-value>)",
          700: "rgb(var(--g700) / <alpha-value>)",
          800: "rgb(var(--g800) / <alpha-value>)",
          900: "rgb(var(--g900) / <alpha-value>)",
          950: "rgb(var(--g950) / <alpha-value>)",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
