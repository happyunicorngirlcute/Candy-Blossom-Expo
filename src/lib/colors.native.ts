export const themeColors = {
  light: {
    bg: "#ffffff",
    text: "#F2B5CE",
    accent: "#DA0D77",
    border: "#e5e7eb",
    muted: "#6b7280",
    surface: "#f9fafb",
    whiteText: "#F2B5CE",
  },
  dark: {
    bg: "#08080a",
    text: "#f7f8f8",
    accent: "#f2b5ce",
    border: "#16161a",
    muted: "#8a8f98",
    surface: "#111113",
    whiteText: "#ffffff",
  },
} as const

export type ThemeColorSet = typeof themeColors.light
