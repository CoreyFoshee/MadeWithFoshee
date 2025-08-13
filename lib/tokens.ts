// Lake With Foshee Brand Design Tokens

export const brandTokens = {
  colors: {
    // Primary brand colors
    "fos-primary-dark": "#1E676B",
    "fos-primary": "#1F7A7E",
    "fos-primary-light": "#A8D7D6",

    // Neutral colors
    "fos-neutral-deep": "#3E4A4D",
    "fos-neutral": "#6B7276",
    "fos-neutral-light": "#F6F1E9",

    // Accent colors
    "fos-accent-orange": "#E79A3C",
    "fos-accent-peach": "#F2B3A1",
    "fos-accent-pink": "#F1D1CD",
    "fos-accent-green": "#76A968",
    "fos-accent-cyan": "#CFEFF2",
  },

  fonts: {
    serif: "var(--font-serif)", // Libre Baskerville 700
    sans: "var(--font-sans)", // Montserrat 400/600
  },

  spacing: {
    // Airy layout spacing
    section: "4rem",
    card: "1.5rem",
    element: "1rem",
  },

  borderRadius: {
    card: "1rem",
    button: "0.5rem",
  },

  shadows: {
    soft: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    card: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },
}

// Inject CSS variables for brand tokens
export function injectBrandTokens() {
  if (typeof document !== "undefined") {
    const root = document.documentElement

    Object.entries(brandTokens.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value)
    })
  }
}
