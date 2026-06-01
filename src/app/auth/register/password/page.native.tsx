import { useState, useMemo, Suspense } from "react"
import { View, Text, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import { motion } from "@/lib/motion"
import { useRouter, useSearchParams } from "expo-router"
import { useAuth } from "@/components/AuthProvider"
import { fetchBackend } from "@/lib/fetchApi"
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

function RegisterPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const { dark } = useTheme()
  const c = useMemo(() => (dark ? themeColors.dark : themeColors.light), [dark])
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { login } = useAuth()

  async function handleSubmit() {
    if (!email) {
      setError("Email is missing. Please try the registration again.")
      return
    }
    setError(null)
    setLoading(true)
    try {
      const res = await fetchBackend("/register/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Failed to complete registration.")
        return
      }
      if (data.token && data.user) {
        login(data.token, JSON.stringify(data.user))
        router.push("/dashboard")
        return
      }
      router.push("/?registered=true")
    } catch {
      setError("Cannot connect to backend.")
    } finally {
      setLoading(false)
    }
  }

  const passwordValid = password.length >= 6

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.bg }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 24 }}>
        <motion.View variants={containerVariants} initial="hidden" animate="visible" style={{ width: "100%", maxWidth: 400, alignItems: "center", gap: 20 }}>
          <motion.View variants={itemVariants}>
            <Text style={{ fontSize: 26, fontWeight: "600", textAlign: "center", color: c.text }}>
              Your Password?
            </Text>
          </motion.View>

          <motion.View variants={itemVariants} style={{ width: "100%", gap: 12 }}>
            <TextInput
              autoFocus
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="At least 6 characters"
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

            {error && (
              <Text style={{ color: "#CA2A30", fontSize: 12, textAlign: "left" }}>{error}</Text>
            )}

            <Pressable
              onPress={handleSubmit}
              disabled={!passwordValid || loading}
              style={{
                width: "100%",
                paddingVertical: 10,
                borderRadius: 8,
                backgroundColor: passwordValid && !loading ? c.text : c.border,
                alignItems: "center",
                opacity: passwordValid && !loading ? 1 : 0.6,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                {loading && <ActivityIndicator size="small" color={c.bg} />}
                <Text style={{ fontWeight: "600", fontSize: 14, color: passwordValid && !loading ? c.bg : c.muted }}>
                  {loading ? "Finishing..." : "Complete Registration"}
                </Text>
              </View>
            </Pressable>
          </motion.View>
        </motion.View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default function RegisterPassword() {
  return (
    <Suspense fallback={
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="small" />
      </View>
    }>
      <RegisterPasswordContent />
    </Suspense>
  )
}
