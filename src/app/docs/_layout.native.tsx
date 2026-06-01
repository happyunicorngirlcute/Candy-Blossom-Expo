import { useMemo } from "react"
import { View, Text, Pressable, ScrollView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { usePathname, Link } from "expo-router"
import { useTheme } from "@/components/ThemeProvider"
import { themeColors } from "@/lib/colors"
import { sections } from "./constants"

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { dark } = useTheme()
  const c = useMemo(() => (dark ? themeColors.dark : themeColors.light), [dark])
  const insets = useSafeAreaInsets()

  const navLink = (href: string, label: string) => {
    const active = pathname === href
    return (
      <Link key={href} href={href} asChild>
        <Pressable style={{ paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, backgroundColor: active ? c.surface : "transparent" }}>
          <Text style={{ fontSize: 13, fontWeight: active ? "500" : "400", color: active ? c.text : c.muted + "99" }}>{label}</Text>
        </Pressable>
      </Link>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top + 60 }}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ width: 220, borderRightWidth: 1, borderRightColor: c.border, padding: 16, backgroundColor: c.bg }}>
          <ScrollView>
            <Text style={{ fontSize: 10, fontWeight: "700", letterSpacing: 2, opacity: 0.4, marginBottom: 12, color: c.text }}>INTRODUCTION</Text>
            {navLink("/docs", "Getting Started")}
            <View style={{ height: 24 }} />
            <Text style={{ fontSize: 10, fontWeight: "700", letterSpacing: 2, opacity: 0.4, marginBottom: 12, color: c.text }}>API REFERENCE</Text>
            {sections.map((s) => navLink(`/docs/${s.slug}`, s.title))}
          </ScrollView>
        </View>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24, maxWidth: 700 }}>
          {children}
        </ScrollView>
      </View>
    </View>
  )
}
