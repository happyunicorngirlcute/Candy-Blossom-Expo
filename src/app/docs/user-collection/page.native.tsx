import { useMemo } from "react"
import { View, Text } from "react-native"
import { useTheme } from "@/components/ThemeProvider"
import { themeColors } from "@/lib/colors"
import { MethodBadge, CodeBlock } from "../components"

const endpoints = [
  {
    method: "GET" as const,
    path: "/user/plants",
    description: "Get all plants in the authenticated user's collection",
    auth: true,
    response: '{\n  "data": [\n    {\n      "id": 1,\n      "city": "Paris",\n      "nextWateringAt": "2025-06-10",\n      "plant": {\n        "id": 1,\n        "common_name": "Monstera",\n        ...\n      }\n    }\n  ]\n}',
  },
  {
    method: "POST" as const,
    path: "/user/plant",
    description: "Add a plant to the user's collection",
    auth: true,
    body: '{\n  "plant_id": 1,\n  "city": "Paris"\n}',
    response: '{\n  "message": "Plant added successfully!",\n  "id": 1\n}',
  },
  {
    method: "DELETE" as const,
    path: "/user/plant/{id}",
    description: "Delete a plant from the user's collection",
    auth: true,
    response: '{\n  "message": "Plant deleted"\n}',
  },
  {
    method: "POST" as const,
    path: "/user/plant/{id}/image",
    description: "Upload an image for a plant in the collection",
    auth: true,
    body: "multipart/form-data — image file",
    response: '{\n  "message": "Image updated"\n}',
  },
]

export default function UserCollectionPage() {
  const { dark } = useTheme()
  const c = useMemo(() => (dark ? themeColors.dark : themeColors.light), [dark])

  return (
    <View style={{ gap: 32 }}>
      <Text style={{ fontSize: 22, fontWeight: "600", color: c.text }}>User Collection</Text>
      {endpoints.map((ep, i) => (
        <View key={i} style={{ gap: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <MethodBadge method={ep.method} />
            <Text style={{ fontFamily: "monospace", fontSize: 13, color: c.text }}>{ep.path}</Text>
            {ep.auth && <Text style={{ fontSize: 9, fontWeight: "700", color: "#f59e0b", backgroundColor: "#f59e0b18", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>AUTH</Text>}
          </View>
          <Text style={{ fontSize: 13, lineHeight: 20, color: c.muted }}>{ep.description}</Text>
          {ep.body && <CodeBlock label="Request Body" code={ep.body} />}
          <CodeBlock label="Response" code={ep.response} />
        </View>
      ))}
    </View>
  )
}
