import type { Config } from "tailwindcss";

// K. C. Model School & College brand configuration.
// English typography remains the primary font; Bengali fonts are
// included before generic fallbacks so Bengali glyphs render consistently.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],

  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#176B45",
          dark: "#124C36",
        },
        soft: {
          green: "#6F8F7D",
        },
        brass: "#B59A4A",
        brick: "#B94A4A",
        burgundy: "#7F3035",
        background: "#F7F5EF",
        surface: "#EFEEE7",
        ink: {
          DEFAULT: "#242824",
          muted: "#69716B",
        },
        border: "#D9D8CF",
      },

      fontFamily: {
        // Editorial English serif with Bengali serif fallback.
        heading: [
          "var(--font-heading)",
          "var(--font-bangla-heading)",
          "'Noto Serif Bengali'",
          "Georgia",
          "serif",
        ],

        // English body/UI font with Bengali sans-serif fallback.
        sans: [
          "var(--font-sans)",
          "var(--font-bangla)",
          "'Noto Sans Bengali'",
          "system-ui",
          "sans-serif",
        ],

        // Explicit Bengali body font.
        bangla: ["var(--font-bangla)", "'Noto Sans Bengali'", "sans-serif"],

        // Explicit Bengali heading font.
        "bangla-heading": [
          "var(--font-bangla-heading)",
          "'Noto Serif Bengali'",
          "'Noto Sans Bengali'",
          "serif",
        ],
      },

      maxWidth: {
        content: "80rem",
      },
    },
  },

  plugins: [],
};

export default config;
