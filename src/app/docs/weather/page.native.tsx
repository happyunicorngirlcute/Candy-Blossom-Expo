import { useMemo } from "react"
import { View, Text } from "react-native"
import { useTheme } from "@/components/ThemeProvider"
import { themeColors } from "@/lib/colors"
import { MethodBadge, CodeBlock } from "../components"

const endpoints = [
  {
    method: "GET" as const,
    path: "/user/weather",
    description: "Get the weather forecast for the authenticated user's city",
    auth: true,
    response: '{\n  "city": "Paris",\n  "country": "FR",\n  "temperature": 22,\n  "condition": "Partly cloudy",\n  "humidity": 65,\n  "wind_speed": 12\n}',
  },
]

export default function WeatherPage() {
  const { dark } = useTheme()
  const c = useMemo(() => (dark ? themeColors.dark : themeColors.light), [dark])

  return (
    <View style={{ gap: 32 }}>
      <Text style={{ fontSize: 22, fontWeight: "600", color: c.text }}>Weather</Text>
      {endpoints.map((ep, i) => (
        <View key={i} style={{ gap: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <MethodBadge method={ep.method} />
            <Text style={{ fontFamily: "monospace", fontSize: 13, color: c.text }}>{ep.path}</Text>
            {ep.auth && <Text style={{ fontSize: 9, fontWeight: "700", color: "#f59e0b", backgroundColor: "#f59e0b18", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>AUTH</Text>}
          </View>
          <Text style={{ fontSize: 13, lineHeight: 20, color: c.muted }}>{ep.description}</Text>
          <CodeBlock label="Response" code={ep.response} />
        </View>
      ))}
    </View>
  )
}
