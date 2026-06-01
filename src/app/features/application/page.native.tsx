import { useMemo } from "react"
import { Text } from "react-native"
import FeaturePage from "@/components/FeaturePage"
import { useTheme } from "@/components/ThemeProvider"
import { themeColors } from "@/lib/colors"

export default function ApplicationPage() {
  const { dark } = useTheme()
  const c = useMemo(() => (dark ? themeColors.dark : themeColors.light), [dark])
  return (
    <FeaturePage title="Mobile & Web App" accent="#a855f7" subtitle="Your garden, everywhere">
      <Text style={{ fontSize: 15, lineHeight: 22, color: c.muted }}>
        Access Candy Blossom from any device. Our web app and mobile application sync seamlessly so you can care for your plants wherever you are.
      </Text>
    </FeaturePage>
  )
}
