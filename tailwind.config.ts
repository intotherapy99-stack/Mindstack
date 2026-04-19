import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        /* ── Surface Hierarchy (DESIGN.md "stacked paper" model) ── */
        surface: {
          DEFAULT: "#f6fafa",
          dim: "#d6dbda",
          bright: "#f6fafa",
          "container-lowest": "#ffffff",
          "container-low": "#eef5f4",
          container: "#e8efee",
          "container-high": "#e3eae8",
          "container-highest": "#dde4e3",
        },
        "on-surface": {
          DEFAULT: "#2a3434",
          variant: "#3f4948",
        },
        outline: {
          DEFAULT: "#6f7978",
          variant: "#a9b4b4",
        },
        /* ── Primary (Teal — Trust & Calm) ── */
        primary: {
          DEFAULT: "#006a6c",
          dim: "#005052",
          container: "#76e6e8",
          "on-container": "#002020",
          fixed: "#76e6e8",
          "fixed-dim": "#56cacc",
          50: "#E6F4F4",
          100: "#B3DFE0",
          200: "#80CBCC",
          300: "#4DB6B8",
          400: "#26A7A9",
          500: "#00979A",
          600: "#007A7C",
          700: "#005D5F",
          800: "#004042",
          900: "#002325",
        },
        /* ── Secondary (Warm Neutral) ── */
        secondary: {
          DEFAULT: "#4a6362",
          container: "#cde8e6",
          "on-container": "#05201f",
        },
        /* ── Tertiary (Calming Blue) ── */
        tertiary: {
          DEFAULT: "#4a607b",
          container: "#b6dffe",
          "on-container": "#041c35",
        },
        /* ── Accent (Coral — Energy & Warmth) ── */
        accent: {
          50: "#FFF1EE",
          100: "#FFDDD6",
          200: "#FFC5B9",
          300: "#FFA090",
          400: "#FF7A66",
          500: "#FF5A42",
          600: "#E04030",
          700: "#C02820",
          800: "#A01510",
        },
        /* ── Neutral (Warm Grays) ── */
        neutral: {
          50: "#FAFAF9",
          100: "#F5F4F2",
          200: "#EBEBEA",
          300: "#D6D5D3",
          400: "#BFBDBA",
          500: "#8C8A87",
          600: "#6B6966",
          700: "#4A4845",
          800: "#2E2C29",
          900: "#1A1815",
        },
        /* ── Semantic ── */
        supervision: {
          DEFAULT: "#8B5CF6",
          light: "#EDE9FE",
        },
        success: "#22C55E",
        warning: "#F59E0B",
        error: {
          DEFAULT: "#EF4444",
          container: "#fa746f",
        },
        info: "#3B82F6",
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        xl: "1.5rem",
        "2xl": "2rem",
        "3xl": "3rem",
      },
      boxShadow: {
        /* Ambient / Long Shadows per DESIGN.md */
        card: "0 2px 30px rgba(42,52,52,0.04)",
        "card-hover": "0 4px 40px rgba(42,52,52,0.06)",
        glow: "0 0 20px rgba(0,106,108,0.12)",
        "glow-purple": "0 0 20px rgba(139,92,246,0.12)",
        "focus-glow": "0 0 0 3px rgba(118,230,232,0.5)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
