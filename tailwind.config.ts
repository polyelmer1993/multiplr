import type { Config } from "tailwindcss";

/**
 * Multiplr — Indigo + Bone.
 * Every value here comes from the locked brand system. Do not add hues:
 * no copper, no orange, no forest green, no dark theme.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    // Locked palette. Replacing (not extending) colors makes an off-brand
    // hue a build error rather than a judgement call.
    colors: {
      transparent: "transparent",
      current: "currentColor",
      bone: "#e8e6e0",
      paper: "#ffffff",
      ink: "#0a0a0a",
      muted: "#5c5c56",
      strike: "#1925aa",
      deep: "#0d1355",
    },
    // Nothing in Multiplr rounds.
    borderRadius: {
      none: "0px",
      DEFAULT: "0px",
    },
    borderWidth: {
      DEFAULT: "1px",
      0: "0px",
      hairline: "1px",
      active: "2px",
    },
    // Elevation is a border, never a shadow.
    boxShadow: {
      none: "none",
    },
    screens: {
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: "1440px",
    },
    fontFamily: {
      display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
      sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
    },
    fontSize: {
      display: [
        "clamp(2.5rem, 1.6rem + 4.2vw, 4.5rem)",
        { lineHeight: "1.02", letterSpacing: "-0.045em", fontWeight: "400" },
      ],
      "heading-lg": [
        "clamp(1.875rem, 1.3rem + 2.2vw, 2.5rem)",
        { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "500" },
      ],
      "heading-md": [
        "clamp(1.5rem, 1.15rem + 1.4vw, 2rem)",
        { lineHeight: "1.2", letterSpacing: "-0.015em", fontWeight: "500" },
      ],
      "heading-sm": ["1.75rem", { lineHeight: "1.25", fontWeight: "400" }],
      body: ["1.0625rem", { lineHeight: "1.55", fontWeight: "400" }],
      "body-sm": ["0.9375rem", { lineHeight: "1.5", fontWeight: "400" }],
      ui: ["0.875rem", { lineHeight: "1.3", letterSpacing: "0", fontWeight: "500" }],
      "mono-label": ["0.75rem", { lineHeight: "1.3", letterSpacing: "0.02em", fontWeight: "500" }],
      "mono-micro": ["0.65625rem", { lineHeight: "1.3", letterSpacing: "0.02em", fontWeight: "500" }],
    },
    extend: {
      spacing: {
        "s-1": "4px",
        "s-2": "8px",
        "s-3": "12px",
        "s-4": "16px",
        "s-5": "24px",
        "s-6": "32px",
        "s-7": "48px",
        "s-8": "64px",
        "s-9": "96px",
      },
      maxWidth: {
        stage: "1200px",
        measure: "68ch",
        "measure-tight": "60ch",
      },
      opacity: {
        disabled: "0.4",
        loading: "0.6",
      },
      transitionTimingFunction: {
        calm: "cubic-bezier(0.22, 0.61, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
