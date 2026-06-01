import { useMemo } from "react"
import { View, Text } from "react-native"
import { useTheme } from "@/components/ThemeProvider"
import { themeColors } from "@/lib/colors"
import { CodeBlock } from "./components"

export default function DocsPage() {
  const { dark } = useTheme()
  const c = useMemo(() => (dark ? themeColors.dark : themeColors.light), [dark])
  const fetchExample = `const response = await fetch('https://api.candyblossom.com/plants', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Content-Type': 'application/json',
  },
});

const data = await response.json();
console.log(data);`

  return (
    <View>
      <View style={{ marginBottom: 48 }}>
        <Text style={{ fontSize: 15, lineHeight: 24, color: c.muted, maxWidth: 600 }}>
          Welcome to Candy Blossom's API. Our API is designed around REST, returning JSON-encoded responses and using standard HTTP response codes
        </Text>
      </View>

      <View style={{ marginBottom: 48 }}>
        <Text style={{ fontSize: 20, fontWeight: "600", color: c.text, marginBottom: 16 }}>Getting Started</Text>
        <Text style={{ fontSize: 13, lineHeight: 20, color: c.muted, marginBottom: 16 }}>
          You should authenticate in order to use most endpoints. You can obtain this token by calling the <Text style={{ backgroundColor: c.surface, paddingHorizontal: 4, borderRadius: 4 }}>/login</Text> endpoint
        </Text>
        <CodeBlock label="Example Request" code={fetchExample} language="javascript" />
      </View>
    </View>
  )
}
