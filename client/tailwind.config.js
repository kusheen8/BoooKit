/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#facc15", // yellow-400
          foreground: "#000000", // black text on yellow
        },
        secondary: {
          DEFAULT: "#fef08a", // light yellow accent
          foreground: "#000000",
        },
        background: "#ffffff",
        foreground: "#111111",
        muted: "#f5f5f5",
        border: "#e5e7eb",
        destructive: "#ef4444",
      },
    },
  },
  plugins: [],
};
