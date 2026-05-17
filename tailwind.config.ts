import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Reference palette — softer & warmer
        cream:    "#F8F6F3",
        sand:     "#E5DDD0",
        bark:     "#2D2424",
        charcoal: "#1A1515",
        noir:     "#0F0D0A",
        accent:   "#B8935A",   // shifted gold accent
        gold:     "#C9A45F",
        muted:    "#8B7355",
        ring:     "#B8935A",
      },
      fontFamily: {
        // Inter is the primary in the reference. Cormorant kept as decorative
        // option for hero headlines if we want to mix.
        sans:  ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        wider:  "0.08em",
        widest: "0.2em",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft:  "0 4px 12px rgba(45,36,36,0.08)",
        card:  "0 8px 24px -8px rgba(45,36,36,0.12)",
        hover: "0 20px 40px -10px rgba(45,36,36,0.18)",
        big:   "0 25px 50px -12px rgba(45,36,36,0.22)",
        glass: "0 10px 30px rgba(45,36,36,0.10)",
      },
      backdropBlur: { xs: "2px", lg: "20px" },
      keyframes: {
        "fade-in":    { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "fade-in-up": { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "fade-in-left": { "0%": { opacity: "0", transform: "translateX(-30px)" }, "100%": { opacity: "1", transform: "translateX(0)" } },
        "scale-in":   { "0%": { opacity: "0", transform: "scale(0.92)" }, "100%": { opacity: "1", transform: "scale(1)" } },
        "slide-in":   { "0%": { transform: "translateX(100%)", opacity: "0" }, "100%": { transform: "translateX(0)", opacity: "1" } },
        "float":      { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-12px)" } },
        "pulse-glow": { "0%, 100%": { boxShadow: "0 0 0 0 rgba(184,147,90,0.5)" }, "50%": { boxShadow: "0 0 0 12px rgba(184,147,90,0)" } },
      },
      animation: {
        "fade-in":      "fade-in 0.5s ease-out both",
        "fade-in-up":   "fade-in-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in-left": "fade-in-left 0.7s cubic-bezier(0.22,1,0.36,1) both",
        "scale-in":     "scale-in 0.4s cubic-bezier(0.22,1,0.36,1) both",
        "slide-in":     "slide-in 0.3s ease-out both",
        "float":        "float 5s ease-in-out infinite",
        "pulse-glow":   "pulse-glow 2s infinite",
      },
    },
  },
  plugins: [],
};
export default config;
