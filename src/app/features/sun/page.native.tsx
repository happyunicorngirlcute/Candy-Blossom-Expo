import { useMemo } from "react"
import { Text } from "react-native"
import FeaturePage from "@/components/FeaturePage"
import { useTheme } from "@/components/ThemeProvider"
import { themeColors } from "@/lib/colors"

export default function SunPage() {
  const { dark } = useTheme()
  const c = useMemo(() => (dark ? themeColors.dark : themeColors.light), [dark])
  return (
    <FeaturePage title="Sunlight Tracking" accent="#f59e0b" subtitle="Perfect light, every day">
      <Text style={{ fontSize: 15, lineHeight: 22, color: c.muted }}>
        Know exactly when to move your plants into the sun or shade. Track sunlight exposure based on your plant's specific needs and your local weather.
      </Text>
    </FeaturePage>
  )
}
