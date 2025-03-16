import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {

    extend: {
      fontFamily: {
        sans: [
          '"Albert Sans"',
          "sans-serif",
        ],
        header: [
          '"League Gothic"',
          "sans-serif",
        ],
        noto: [
          '"Noto Sans"',
          "sans-serif",
        ]
      },
    },
  },
  plugins: [],
} satisfies Config;
