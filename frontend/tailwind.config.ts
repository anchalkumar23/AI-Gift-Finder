import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "oklch(0.50 0.19 235)",
          deep: "oklch(0.42 0.19 235)",
        },
        accent: {
          DEFAULT: "oklch(0.65 0.19 35)",
          deep: "oklch(0.55 0.19 35)",
        },
        safe: {
          DEFAULT: "oklch(0.48 0.10 170)",
          deep: "oklch(0.36 0.10 170)",
        },
        surface: "oklch(0.97 0.01 235)",
        ink: "oklch(0.18 0.02 235)",
        muted: "oklch(0.50 0.015 235)",
      },
      fontFamily: {
        sans: ["var(--font-sora)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "14px",
      },
      boxShadow: {
        highlight: "0 8px 24px oklch(0.50 0.19 235 / 0.16)",
      },
    },
  },
  plugins: [],
};
export default config;
