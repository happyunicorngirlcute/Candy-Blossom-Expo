import { useMemo } from "react"
import { Text } from "react-native"
import FeaturePage from "@/components/FeaturePage"
import { useTheme } from "@/components/ThemeProvider"
import { themeColors } from "@/lib/colors"

export default function GrowingPage() {
  const { dark } = useTheme()
  const c = useMemo(() => (dark ? themeColors.dark : themeColors.light), [dark])
  return (
    <FeaturePage title="Growth Tracking" accent="#22c55e" subtitle="Watch them thrive">
      <Text style={{ fontSize: 15, lineHeight: 22, color: c.muted }}>
        Track your plant's growth over time. Log milestones, take progress photos, and see how your care routine helps them flourish.
      </Text>
    </FeaturePage>
  )
}
