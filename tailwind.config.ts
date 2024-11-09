import type { Config } from "tailwindcss"

import { fontFamily } from "tailwindcss/defaultTheme"

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      screens: { md: "40rem" },
      padding: "1rem",
      center: true,
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: ({ colors }) => ({
        border: {
          DEFAULT: "rgba(0,0,0,0.1)",
          50: "rgba(0,0,0,0.05)",
          150: "rgba(0,0,0,0.15)",
          200: "rgba(0,0,0,0.2)",
        },
        ring: {
          DEFAULT: colors.indigo[500],
        },
      }),
      borderColor: ({ theme }) => ({ DEFAULT: theme("colors.border.DEFAULT") }),
      ringColor: ({ theme }) => ({ DEFAULT: theme("colors.ring.DEFAULT") }),
      ringOpacity: { DEFAULT: "1" },
    },
  },
  plugins: [],
} satisfies Config
