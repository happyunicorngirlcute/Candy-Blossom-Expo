import { useMemo } from "react"
import { Text } from "react-native"
import FeaturePage from "@/components/FeaturePage"
import { useTheme } from "@/components/ThemeProvider"
import { themeColors } from "@/lib/colors"

export default function UploadingPage() {
  const { dark } = useTheme()
  const c = useMemo(() => (dark ? themeColors.dark : themeColors.light), [dark])
  return (
    <FeaturePage title="Plant Identification" accent="#10b981" subtitle="Snap. Identify. Learn.">
      <Text style={{ fontSize: 15, lineHeight: 22, color: c.muted }}>
        Upload a photo of any plant and instantly identify it. Get detailed care information, watering schedules, and sunlight requirements.
      </Text>
    </FeaturePage>
  )
}
