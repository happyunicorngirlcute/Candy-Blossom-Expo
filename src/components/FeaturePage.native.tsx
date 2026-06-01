import { useMemo } from "react"
import { View, Text, ScrollView } from "react-native"
import { motion } from "@/lib/motion"
import { useTheme } from "@/components/ThemeProvider"
import { themeColors } from "@/lib/colors"

export default function FeaturePage({ title, accent, subtitle, children }: {
  title: string
  accent: string
  subtitle?: string
  children?: React.ReactNode
}) {
  const { dark } = useTheme()
  const c = useMemo(() => (dark ? themeColors.dark : themeColors.light), [dark])

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.bg }} contentContainerStyle={{ paddingTop: 120, paddingBottom: 60, paddingHorizontal: 24 }}>
      <View style={{ maxWidth: 900, alignSelf: "center", flexDirection: "column", gap: 24 }}>
        <motion.View initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Text style={{ fontSize: 28, fontWeight: "600", lineHeight: 34, marginBottom: 12, color: c.text }}>
            {title}
            {subtitle && (
              <Text style={{ color: accent }}>{`\n${subtitle}`}</Text>
            )}
          </Text>
          {children}
        </motion.View>
      </View>
    </ScrollView>
  )
}
