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
        // Brighter tints of the existing palette for charts, glows and accents.
        leaf: {
          DEFAULT: "#1F8A5B",
          bright: "#27A872",
          mint: "#E3F2E9",
        },
        gold: {
          DEFAULT: "#C9A83F",
          soft: "#F3EAC8",
        },
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

        // Legacy pages use font-serif; keep it identical to the heading face.
        serif: [
          "var(--font-heading)",
          "var(--font-bangla-heading)",
          "'Noto Serif Bengali'",
          "Georgia",
          "serif",
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

      // Consistent corner scale used across public pages, portals and dashboards.
      // controls: md/lg (10-12px) | cards: xl (16px) | panels: 2xl/3xl (20px)
      borderRadius: {
        none: "0",
        sm: "0.375rem",
        DEFAULT: "0.5rem",
        md: "0.625rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.25rem",
        full: "9999px",
      },

      // Slightly larger, still restrained reading sizes (headings are unchanged).
      fontSize: {
        xs: ["0.8125rem", { lineHeight: "1.25rem" }],
        sm: ["0.9375rem", { lineHeight: "1.5rem" }],
        base: ["1.0625rem", { lineHeight: "1.7rem" }],
        lg: ["1.1875rem", { lineHeight: "1.8rem" }],
        xl: ["1.375rem", { lineHeight: "1.9rem" }],
      },

      // Soft, green-tinted elevation shared by all cards.
      boxShadow: {
        card: "0 1px 2px rgba(18,76,54,.05), 0 8px 24px -12px rgba(18,76,54,.12)",
        lift: "0 2px 4px rgba(18,76,54,.06), 0 18px 40px -16px rgba(18,76,54,.22)",
      },

      maxWidth: {
        content: "80rem",
      },
    },
  },

  plugins: [],
};

export default config;
