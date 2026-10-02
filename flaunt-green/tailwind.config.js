/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#e8efe4",
          100: "#d1dfc9",
          200: "#a3bf93",
          300: "#759f5d",
          400: "#477f27",
          500: "#41542f",
          600: "#344326",
          700: "#27321c",
          800: "#1a2213",
          900: "#0d1109",
          950: "#070905",
        },
        gold: {
          DEFAULT: "#997b47",
          light:   "#b8945a",
          dark:    "#7a6238",
          outline: "#c4a265",
        },
        midnight: {
          DEFAULT: "#141b28",
          light:   "#1e2a3d",
          dark:    "#0b0f16",
        },
        ivory: {
          DEFAULT: "#f7ece6",
          light:   "#fcf7f4",
          dark:    "#e8d5c9",
        },
        clay: {
          DEFAULT: "#ecd1cb",
          light:   "#f5e6e2",
          dark:    "#dbb0a5",
        },
        sage: {
          DEFAULT: "#c2e1b7",
          light:   "#dff0d9",
          dark:    "#9fcf8f",
        },
        earth: {
          beige:    "#d8cfbc",
          taupe:    "#ad9e85",
          stone:    "#746f6d",
          terracotta: "#c17e69",
          indigo:   "#7694cc",
          wood:     "#a96d37",
        },
        tertiary: {
          leaf:     "#9AA60F",
          mustard:  "#E6C200",
          orange:   "#D9541E",
          red:      "#E01E37",
          maroon:   "#7A1A12",
          purple:   "#5B2C6F",
          brown:    "#7A552C",
        },
        surface: {
          DEFAULT: "#f7ece6",
          secondary: "#ffffff",
          tertiary:  "#ecd1cb",
          dark:      "#141b28",
          "dark-secondary": "#1e2a3d",
          "dark-tertiary":  "#334155",
        },
        text: {
          primary:   "#141b28",
          secondary: "#475569",
          muted:     "#94a3b8",
          inverse:   "#f7ece6",
        },
        accent: {
          DEFAULT: "#997b47",
          light:   "#b8945a",
          dark:    "#7a6238",
        },
        danger:  "#E01E37",
        success: "#41542f",
        warning: "#E6C200",
        info:    "#7694cc",
      },
      fontFamily: {
        sans:    ["'Gill Sans'", "'Gill Sans MT'", "Calibri", "var(--font-sans)", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "Cormorant Garamond", "serif"],
        serif:   ["var(--font-heading)", "Cormorant Garamond", "serif"],
        tagline: ["var(--font-heading)", "Cormorant Garamond", "serif"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        "soft-sm":  "0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)",
        "soft":     "0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07)",
        "soft-lg":  "0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.07)",
        "soft-xl":  "0 20px 25px -5px rgb(0 0 0 / 0.07), 0 8px 10px -6px rgb(0 0 0 / 0.07)",
        "brand":    "0 4px 14px 0 rgb(65 84 47 / 0.4)",
        "gold":     "0 4px 14px 0 rgb(153 123 71 / 0.4)",
      },
      animation: {
    "ticker": "ticker-scroll 25s linear infinite",
    "ticker-fast": "ticker-scroll 8s linear infinite",
        "fade-in":     "fadeIn 0.3s ease-in-out",
        "slide-up":    "slideUp 0.4s ease-out",
        "slide-down":  "slideDown 0.4s ease-out",
        "scale-in":    "scaleIn 0.2s ease-out",
        "shimmer":     "shimmer 1.5s infinite",
        "bounce-soft": "bounceSoft 1s infinite",
        "spin-slow":   "spin 3s linear infinite",
        "marquee":     "marquee 25s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)",    opacity: "1" },
        },
        slideDown: {
          "0%":   { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)",     opacity: "1" },
        },
        scaleIn: {
          "0%":   { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)",    opacity: "1" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        bounceSoft: {
          "0%, 100%": { transform: "translateY(-4px)" },
          "50%":      { transform: "translateY(0)" },
        },
        marquee: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "ticker-scroll": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      screens: {
        xs: "475px",
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },
      transitionDuration: {
        "400": "400ms",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
