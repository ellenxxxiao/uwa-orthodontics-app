import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        //         Primary: #2A8BF2
        //  Primary-Focus: #075BB3
        // Secondary: #3584B1
        // Secondary-Focus: #0E5D8A
        // Accent: #667085
        // Accent-Focus: #344054
        // Base100: #EDEDED
        // Base200: #D0D5DD
        // Base300: #B7BDC8
        // White: #FEFEFE
        // Black: #1E1E1E
        // Red: #FF3B30
        // Green: #89BD9E
        // Orange: #F19953
        primary: {
          DEFAULT: "#2A8BF2",
          focus: "#075BB3",
        },
        secondary: {
          DEFAULT: "#3584B1",
          focus: "#0E5D8A",
        },
        accent: {
          DEFAULT: "#667085",
          focus: "#344054",
        },
        base: {
          100: "#EDEDED",
          200: "#D0D5DD",
          300: "#B7BDC8",
        },
        app: {
          white: "#FEFEFE",
          black: "#1E1E1E",
          red: "#FF3B30",
          green: "#89BD9E",
          orange: "#F19953",
        },
      },
    },
  },
  plugins: [],
};
export default config;
