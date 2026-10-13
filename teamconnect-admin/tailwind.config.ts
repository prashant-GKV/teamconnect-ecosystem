import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-plus-jakarta)", ...fontFamily.sans],
        body:    ["var(--font-inter)",        ...fontFamily.sans],
        mono:    ["var(--font-jetbrains-mono)", ...fontFamily.mono],
      },
      colors: {
        // Design tokens mapped to CSS variables
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          hover:   "hsl(var(--primary-hover))",
          subtle:  "hsl(var(--primary-subtle))",
          foreground: "hsl(var(--primary-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input:  "hsl(var(--input))",
        ring:   "hsl(var(--ring))",
        // Semantic
        success: {
          DEFAULT:    "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
          subtle:     "hsl(var(--success-subtle))",
        },
        warning: {
          DEFAULT:    "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
          subtle:     "hsl(var(--warning-subtle))",
        },
        danger: {
          DEFAULT:    "hsl(var(--danger))",
          foreground: "hsl(var(--danger-foreground))",
          subtle:     "hsl(var(--danger-subtle))",
        },
        info: {
          DEFAULT:    "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
          subtle:     "hsl(var(--info-subtle))",
        },
        // Scope colors
        scope: {
          category: "hsl(var(--scope-category))",
          project:  "hsl(var(--scope-project))",
          "category-subtle": "hsl(var(--scope-category-subtle))",
          "project-subtle":  "hsl(var(--scope-project-subtle))",
        },
      },
      borderRadius: {
        sm: "calc(var(--radius) - 4px)",
        DEFAULT: "var(--radius)",
        md: "calc(var(--radius) + 0px)",
        lg: "calc(var(--radius) + 4px)",
        xl: "calc(var(--radius) + 8px)",
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
      },
      boxShadow: {
        soft:   "0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
        medium: "0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)",
        card:   "0 0 0 1px hsl(var(--border)), 0 2px 4px rgb(0 0 0 / 0.06)",
        "card-hover": "0 0 0 1px hsl(var(--border)), 0 4px 12px rgb(0 0 0 / 0.1)",
      },
      animation: {
        "skeleton-shimmer": "skeleton-shimmer 1.5s ease-in-out infinite",
        "slide-in-right": "slide-in-right 0.2s ease-out",
        "slide-in-up":    "slide-in-up 0.2s ease-out",
        "fade-in":        "fade-in 0.15s ease-out",
      },
      keyframes: {
        "skeleton-shimmer": {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)", opacity: "0" },
          to:   { transform: "translateX(0)",    opacity: "1" },
        },
        "slide-in-up": {
          from: { transform: "translateY(8px)", opacity: "0" },
          to:   { transform: "translateY(0)",   opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
