import { useMemo, Linking } from "react"
import { View, Text, Pressable, ScrollView } from "react-native"
import { motion } from "@/lib/motion"
import { useTheme } from "@/components/ThemeProvider"
import { themeColors } from "@/lib/colors"

export default function SourcePage() {
  const { dark } = useTheme()
  const c = useMemo(() => (dark ? themeColors.dark : themeColors.light), [dark])
  const githubUrl = "https://github.com/happyunicorngirlcute/Candy-Blossom"

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.bg }} contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 24 }}>
      <motion.View initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 500, width: "100%", alignItems: "center", gap: 24 }}>
        <Text style={{ fontSize: 16, opacity: 0.6, textAlign: "center", lineHeight: 24, color: c.text }}>
          Our entire frontend codebase is open-source.
        </Text>
        <Pressable
          onPress={() => Linking.openURL(githubUrl)}
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 999,
            backgroundColor: dark ? "#fff" : "#F2B5CE",
          }}
        >
          <Text style={{ fontWeight: "600", fontSize: 13, color: dark ? "#000" : "#fff" }}>
            View on GitHub →
          </Text>
        </Pressable>
      </motion.View>
    </ScrollView>
  )
}
