import { useMemo } from "react"
import { View, Text } from "react-native"
import { useTheme } from "@/components/ThemeProvider"
import { themeColors } from "@/lib/colors"
import { MethodBadge, CodeBlock } from "../components"

const endpoints = [
  {
    method: "POST" as const,
    path: "/login",
    description: "Authenticate a user and return a JWT token",
    body: '{\n  "email": "user@example.com",\n  "password": "password123"\n}',
    response: '{\n  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."\n}',
  },
  {
    method: "POST" as const,
    path: "/register",
    description: "Register a new user account",
    body: '{\n  "email": "user@example.com",\n  "password": "password123",\n  "firstName": "John",\n  "lastName": "Doe"\n}',
    response: '{\n  "message": "I created your account! Check your inbox to verify it",\n  "email": "user@example.com"\n}',
  },
  {
    method: "GET" as const,
    path: "/verify-email",
    description: "Verify email using token",
    pathParams: "token (string) — email verification token",
    response: '{\n  "message": "Email verified successfully!",\n  "email": "user@example.com"\n}',
  },
]

export default function AuthenticationPage() {
  const { dark } = useTheme()
  const c = useMemo(() => (dark ? themeColors.dark : themeColors.light), [dark])

  return (
    <View style={{ gap: 32 }}>
      <Text style={{ fontSize: 22, fontWeight: "600", color: c.text }}>Authentication</Text>
      {endpoints.map((ep, i) => (
        <View key={i} style={{ gap: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <MethodBadge method={ep.method} />
            <Text style={{ fontFamily: "monospace", fontSize: 13, color: c.text }}>{ep.path}</Text>
          </View>
          <Text style={{ fontSize: 13, lineHeight: 20, color: c.muted }}>{ep.description}</Text>
          {ep.pathParams && (
            <View style={{ backgroundColor: c.surface + "80", borderRadius: 8, padding: 12 }}>
              <Text style={{ fontSize: 11, fontFamily: "monospace", color: c.muted }}>{ep.pathParams}</Text>
            </View>
          )}
          {ep.body && <CodeBlock label="Request Body" code={ep.body} />}
          <CodeBlock label="Response" code={ep.response} />
        </View>
      ))}
    </View>
  )
}
