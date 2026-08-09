/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--bg)",
        surface: "var(--card)",
        ink: "var(--ink)",
        line: "var(--line)",
        accent: "var(--accent)",
        positive: "var(--positive)",
        neutral: "var(--neutral)",
        negative: "var(--negative)",
      },
      fontFamily: {
        display: ['"Archivo Black"', "sans-serif"],
        sans: ['"Space Grotesk"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      boxShadow: {
        brutal: "4px 4px 0px var(--ink)",
        "brutal-sm": "2px 2px 0px var(--ink)",
        "brutal-accent": "4px 4px 0px var(--accent)",
      },
    },
  },
  plugins: [],
};
