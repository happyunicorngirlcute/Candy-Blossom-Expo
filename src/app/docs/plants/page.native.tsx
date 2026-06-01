import { useMemo } from "react"
import { View, Text } from "react-native"
import { useTheme } from "@/components/ThemeProvider"
import { themeColors } from "@/lib/colors"
import { MethodBadge, CodeBlock } from "../components"

const endpoints = [
  {
    method: "GET" as const,
    path: "/api/plants/search/{name}/{page}",
    description: "Search for plants by name with pagination",
    response: '{\n  "data": [\n    { "id": 1, "common_name": "Monstera", "scientific_name": ["Monstera deliciosa"], ... }\n  ],\n  "total": 50,\n  "last_page": 5\n}',
  },
  {
    method: "GET" as const,
    path: "/api/plants/{id}",
    description: "Get detailed information about a specific plant",
    response: '{\n  "id": 1,\n  "common_name": "Monstera",\n  "scientific_name": ["Monstera deliciosa"],\n  "watering": " Moderate",\n  "sunlight": ["Partial shade"],\n  "cycle": "Perennial",\n  ...\n}',
  },
]

export default function PlantsPage() {
  const { dark } = useTheme()
  const c = useMemo(() => (dark ? themeColors.dark : themeColors.light), [dark])

  return (
    <View style={{ gap: 32 }}>
      <Text style={{ fontSize: 22, fontWeight: "600", color: c.text }}>Plants API</Text>
      {endpoints.map((ep, i) => (
        <View key={i} style={{ gap: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <MethodBadge method={ep.method} />
            <Text style={{ fontFamily: "monospace", fontSize: 13, color: c.text }}>{ep.path}</Text>
          </View>
          <Text style={{ fontSize: 13, lineHeight: 20, color: c.muted }}>{ep.description}</Text>
          <CodeBlock label="Response" code={ep.response} />
        </View>
      ))}
    </View>
  )
}
