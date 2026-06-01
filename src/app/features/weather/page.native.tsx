import { useMemo } from "react"
import { Text } from "react-native"
import FeaturePage from "@/components/FeaturePage"
import { useTheme } from "@/components/ThemeProvider"
import { themeColors } from "@/lib/colors"

export default function WeatherPage() {
  const { dark } = useTheme()
  const c = useMemo(() => (dark ? themeColors.dark : themeColors.light), [dark])
  return (
    <FeaturePage title="Weather Integration" accent="#0ea5e9" subtitle="Care that adapts to the sky">
      <Text style={{ fontSize: 15, lineHeight: 22, color: c.muted }}>
        Real-time weather data adjusts care recommendations automatically. Rain, heat, or cold — your plants are always prepared.
      </Text>
    </FeaturePage>
  )
}
