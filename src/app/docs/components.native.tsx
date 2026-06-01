import { useMemo } from "react"
import { View, Text, Platform } from "react-native"
import { useTheme } from "@/components/ThemeProvider"
import { themeColors } from "@/lib/colors"

export const MethodBadge = ({ method }: { method: string }) => {
  const { dark } = useTheme()
  const badgeColor = {
    GET: dark ? "#60a5fa" : "#2563eb",
    POST: dark ? "#34d399" : "#059669",
    DELETE: dark ? "#f87171" : "#dc2626",
    PUT: dark ? "#fbbf24" : "#d97706",
  }[method] || "#999"

  return (
    <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, backgroundColor: badgeColor + "18" }}>
      <Text style={{ fontSize: 11, fontWeight: "700", color: badgeColor }}>{method}</Text>
    </View>
  )
}

export const CodeBlock = ({ code, label }: { code: string; label?: string; className?: string; language?: string }) => {
  const { dark } = useTheme()
  const c = useMemo(() => (dark ? themeColors.dark : themeColors.light), [dark])

  return (
    <View style={{ marginVertical: 12 }}>
      {label && <Text style={{ fontSize: 11, fontWeight: "500", marginBottom: 4, opacity: 0.5, letterSpacing: 1, color: c.text }}>{label.toUpperCase()}</Text>}
      <View style={{ borderRadius: 8, borderWidth: 1, borderColor: c.border, backgroundColor: c.surface, padding: 16 }}>
        <Text style={{ fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace", fontSize: 12, lineHeight: 20, color: c.text }}>{code}</Text>
      </View>
    </View>
  )
}
