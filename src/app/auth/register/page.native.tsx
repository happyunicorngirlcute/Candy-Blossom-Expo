import { useState, useMemo } from "react"
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native"
import { motion } from "@/lib/motion"
import { useRouter } from "expo-router"
import { fetchBackend } from "@/lib/fetchApi"
import { useTheme } from "@/components/ThemeProvider"
import { themeColors } from "@/lib/colors"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function AuthRegister() {
  const router = useRouter()
  const { dark } = useTheme()
  const c = useMemo(() => (dark ? themeColors.dark : themeColors.light), [dark])
  const [step, setStep] = useState(0)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const next = () => setStep((s) => Math.min(1, s + 1))

  const verifyEmail = async () => {
    setError(null)
    setLoading(true)
    try {
      const res = await fetchBackend("/register/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || data.message || "Verification failed")
        return
      }
      setSent(true)
    } catch {
      setError("My backend seems to not work as intended!")
    } finally {
      setLoading(false)
    }
  }

  const emailValid = email.includes("@") && email.includes(".")
  const nameValid = name.trim().length >= 3

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.bg }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 24 }}>
        <motion.View variants={containerVariants} initial="hidden" animate="visible" style={{ width: "100%", maxWidth: 390, alignItems: "center", gap: 20 }}>
          {!sent ? (
            <>
              <motion.View variants={itemVariants}>
                <Text style={{ fontSize: 26, fontWeight: "300", textAlign: "center", color: c.text }}>
                  {step === 0 && "What should I call you?"}
                  {step === 1 && (name ? `What's your email address, ${name}?` : "What's your email address?")}
                </Text>
              </motion.View>

              {step === 0 && (
                <motion.View variants={itemVariants} style={{ width: "100%", alignItems: "center", gap: 12 }}>
                  <TextInput
                    autoFocus
                    value={name}
                    onChangeText={setName}
                    placeholder="Your name"
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
                  <Pressable
                    onPress={next}
                    disabled={!nameValid}
                    style={{
                      width: "100%",
                      paddingVertical: 10,
                      borderRadius: 8,
                      backgroundColor: nameValid ? c.text : c.border,
                      alignItems: "center",
                      opacity: nameValid ? 1 : 0.6,
                    }}
                  >
                    <Text style={{ fontWeight: "600", fontSize: 14, color: nameValid ? c.bg : c.muted }}>
                      Next?
                    </Text>
                  </Pressable>
                </motion.View>
              )}

              {step === 1 && (
                <motion.View variants={itemVariants} style={{ width: "100%", alignItems: "center", gap: 12 }}>
                  <TextInput
                    autoFocus
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

                  {error && (
                    <Text style={{ color: "#CA2A30", fontSize: 12, width: "100%", textAlign: "left" }}>{error}</Text>
                  )}

                  <Pressable
                    onPress={verifyEmail}
                    disabled={!emailValid || loading}
                    style={{
                      width: "100%",
                      paddingVertical: 10,
                      borderRadius: 8,
                      backgroundColor: emailValid && !loading ? c.text : c.border,
                      alignItems: "center",
                      opacity: emailValid && !loading ? 1 : 0.6,
                    }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      {loading && <ActivityIndicator size="small" color={c.bg} />}
                      <Text style={{ fontWeight: "600", fontSize: 14, color: emailValid && !loading ? c.bg : c.muted }}>
                        {loading ? "Sending email..." : "Let's verify that"}
                      </Text>
                    </View>
                  </Pressable>
                </motion.View>
              )}
            </>
          ) : (
            <Text style={{ fontSize: 26, fontWeight: "300", textAlign: "center", paddingHorizontal: 16, color: c.text }}>
              {name}. That's a cool name! Check your inbox
            </Text>
          )}
        </motion.View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
