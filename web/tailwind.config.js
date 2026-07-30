/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        light: {
          bg: "#F8FAFC",
          card: "#FFFFFF",
          subtle: "#F1F5F9",
          border: "#E2E8F0",
        },
        dark: {
          text: "#0F172A",
          muted: "#64748B",
        },
        brand: {
          green: "#10B981",
          greenDark: "#059669",
          blue: "#2563EB",
          blueLight: "#0284C7",
          black: "#0F172A",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
        heading: ["'Outfit'", "sans-serif"],
      },
      boxShadow: {
        lightCard: "0 4px 25px -4px rgba(15, 23, 42, 0.08)",
        greenGlow: "0 4px 20px rgba(16, 185, 129, 0.3)",
        blueGlow: "0 4px 20px rgba(37, 99, 235, 0.3)",
      },
    },
  },
  plugins: [],
};
