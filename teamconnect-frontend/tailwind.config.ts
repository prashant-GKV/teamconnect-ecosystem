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
        heading: ["var(--font-heading)", ...fontFamily.sans],
        body:    ["var(--font-body)",    ...fontFamily.sans],
        mono:    ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
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
          DEFAULT:    "hsl(var(--primary))",
          hover:      "hsl(var(--primary-hover))",
          subtle:     "hsl(var(--primary-subtle))",
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
        // Semantic with strict WCAG AA text contrast
        success: {
          DEFAULT:    "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
          subtle:     "hsl(var(--success-subtle))",
          text:       "hsl(var(--success-text))",
        },
        warning: {
          DEFAULT:    "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
          subtle:     "hsl(var(--warning-subtle))",
          text:       "hsl(var(--warning-text))",
        },
        danger: {
          DEFAULT:    "hsl(var(--danger))",
          foreground: "hsl(var(--danger-foreground))",
          subtle:     "hsl(var(--danger-subtle))",
          text:       "hsl(var(--danger-text))",
        },
        info: {
          DEFAULT:    "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
          subtle:     "hsl(var(--info-subtle))",
          text:       "hsl(var(--info-text))",
        },
        // Scope colors
        scope: {
          category:          "hsl(var(--scope-category))",
          "category-text":   "hsl(var(--scope-category-text))",
          "category-subtle": "hsl(var(--scope-category-subtle))",
          project:           "hsl(var(--scope-project))",
          "project-text":    "hsl(var(--scope-project-text))",
          "project-subtle":  "hsl(var(--scope-project-subtle))",
        },
      },
      borderRadius: {
        xs: "0.25rem",
        sm: "0.375rem",
        DEFAULT: "0.625rem",
        md: "0.75rem",
        lg: "0.875rem",
        xl: "1.125rem",
        "2xl": "1.375rem",
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
      },
      boxShadow: {
        soft:   "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        card:   "0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
        "card-hover": "0 4px 12px -2px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.04)",
      },
      animation: {
        "skeleton-shimmer": "skeleton-shimmer 1.5s ease-in-out infinite",
        "fade-in": "fade-in 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-up": "slide-in-up 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "skeleton-shimmer": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.45" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "slide-in-up": {
          from: { transform: "translateY(6px)", opacity: "0" },
          to:   { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
