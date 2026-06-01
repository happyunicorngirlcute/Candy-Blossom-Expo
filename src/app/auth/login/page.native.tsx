import { useState, useMemo } from "react"
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from "react-native"
import { motion } from "@/lib/motion"
import { useRouter } from "expo-router"
import { useAuth } from "@/components/AuthProvider"
import { useTheme } from "@/components/ThemeProvider"
import { themeColors } from "@/lib/colors"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function Login() {
  const router = useRouter()
  const { dark } = useTheme()
  const c = useMemo(() => (dark ? themeColors.dark : themeColors.light), [dark])
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const API = process.env.EXPO_PUBLIC_API_URL
  const { login } = useAuth()

  async function handleSubmit() {
    setError(null)
    setLoading(true)
    try {
      const url = `${API}/login`
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || data.message || "Login failed")
        return
      }
      if (data.token && data.user) login(data.token, JSON.stringify(data.user))
      router.push("/dashboard")
    } catch {
      setError("Connection failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.bg }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 24 }}>
        <motion.View variants={containerVariants} initial="hidden" animate="visible" style={{ width: "100%", maxWidth: 400, alignItems: "center", gap: 20 }}>
          <motion.View variants={itemVariants}>
            <Text style={{ fontSize: 28, fontWeight: "300", textAlign: "center", color: c.text }}>
              Log in to Candy Blossom
            </Text>
          </motion.View>

          <View style={{ width: "100%", gap: 16, marginTop: 16 }}>
            <View style={{ gap: 6 }}>
              <Text style={{ fontSize: 13, fontWeight: "500", color: c.muted }}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="your@email.com"
                placeholderTextColor={c.muted + "60"}
                style={{
                  width: "100%",
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: c.border,
                  backgroundColor: c.surface,
                  fontSize: 14,
                  color: c.text,
                }}
              />
            </View>

            <View style={{ gap: 6 }}>
              <Text style={{ fontSize: 13, fontWeight: "500", color: c.muted }}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="••••••••"
                placeholderTextColor={c.muted + "60"}
                style={{
                  width: "100%",
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: c.border,
                  backgroundColor: c.surface,
                  fontSize: 14,
                  color: c.text,
                }}
              />
            </View>

            {error && (
              <Text style={{ color: "#CA2A30", fontSize: 12, textAlign: "left" }}>{error}</Text>
            )}

            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              style={{
                width: "100%",
                paddingVertical: 12,
                borderRadius: 8,
                backgroundColor: loading ? c.muted : c.text,
                alignItems: "center",
                justifyContent: "center",
                opacity: loading ? 0.7 : 1,
              }}
            >
              <Text style={{ fontWeight: "600", fontSize: 14, color: c.bg }}>
                {loading ? "Welcoming you..." : "Enter my home"}
              </Text>
            </Pressable>
          </View>
        </motion.View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
