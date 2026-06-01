import { useMemo } from "react"
import { Text } from "react-native"
import FeaturePage from "@/components/FeaturePage"
import { useTheme } from "@/components/ThemeProvider"
import { themeColors } from "@/lib/colors"

export default function WateringPage() {
  const { dark } = useTheme()
  const c = useMemo(() => (dark ? themeColors.dark : themeColors.light), [dark])
  return (
    <FeaturePage title="Smart Watering" accent="#3b82f6" subtitle="Never overwater again">
      <Text style={{ fontSize: 15, lineHeight: 22, color: c.muted }}>
        Get notified exactly when your plants need water. Our system considers species, weather, season, and soil conditions to give you the perfect watering schedule.
      </Text>
    </FeaturePage>
  )
}
