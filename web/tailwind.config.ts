import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lcs: {
          black: "var(--lcs-black)",
          charcoal: "var(--lcs-charcoal)",
          gold: "var(--lcs-gold)",
          "gold-soft": "var(--lcs-gold-soft)",
          white: "var(--lcs-white)",
          muted: "var(--lcs-muted)",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
