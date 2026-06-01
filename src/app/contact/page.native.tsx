import { useState, useMemo, useRef } from "react"
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from "react-native"
import { motion, AnimatePresence } from "@/lib/motion"
import { useTheme } from "@/components/ThemeProvider"
import { themeColors } from "@/lib/colors"

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
}

export default function ContactPage() {
  const { dark } = useTheme()
  const c = useMemo(() => (dark ? themeColors.dark : themeColors.light), [dark])
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = async () => {
    setSending(true)
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("email", email)
      formData.append("_subject", subject)
      formData.append("message", message)
      formData.append("_captcha", "false")
      formData.append("_template", "table")
      await fetch("https://formsubmit.co/nahildiabi8@gmail.com", { method: "POST", body: formData })
    } catch {}
    setSubmitted(true)
    setSending(false)
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.bg }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }}>
        <View style={{ maxWidth: 700, width: "100%", alignSelf: "center", borderRadius: 16, borderWidth: 1, borderColor: c.border, backgroundColor: c.surface, overflow: "hidden" }}>
          <View style={{ flexDirection: "column" }}>
            <View style={{ padding: 32, borderBottomWidth: 1, borderBottomColor: c.border, gap: 16 }}>
              <Text style={{ fontSize: 24, fontWeight: "700", color: c.text }}>Get in touch</Text>
              <Text style={{ fontSize: 13, lineHeight: 18, color: c.muted }}>Have a question, suggestion?</Text>
              <View style={{ gap: 20 }}>
                <View style={{ flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
                  <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: c.accent + "18", alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: 16 }}>✉️</Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 10, fontWeight: "700", letterSpacing: 1, color: c.muted }}>EMAIL</Text>
                    <Text style={{ fontSize: 14, fontWeight: "500", color: c.text }}>nahildiabi8@gmail.com</Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
                  <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: c.accent + "18", alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: 16 }}>📍</Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 10, fontWeight: "700", letterSpacing: 1, color: c.muted }}>LOCATION</Text>
                    <Text style={{ fontSize: 14, fontWeight: "500", color: c.text }}>Saint Etienne - France</Text>
                  </View>
                </View>
              </View>
              <View style={{ height: 1, backgroundColor: c.border }} />
              <Text style={{ fontSize: 11, lineHeight: 16, color: c.muted }}>Ill respond when I can - happyunicorngirlcute</Text>
            </View>

            <View style={{ padding: 32 }}>
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.View key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ alignItems: "center", justifyContent: "center", minHeight: 300, gap: 16 }}>
                    <Text style={{ fontSize: 22, color: c.muted, textAlign: "center" }}>Your message has been sent, I'll check it soon!</Text>
                  </motion.View>
                ) : (
                  <motion.View key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ gap: 16 }}>
                    <View style={{ flexDirection: "row", gap: 12 }}>
                      <View style={{ flex: 1, gap: 6 }}>
                        <Text style={{ fontSize: 11, fontWeight: "700", letterSpacing: 1, color: c.muted }}>NAME</Text>
                        <TextInput value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor={c.muted + "60"} style={{ borderRadius: 12, borderWidth: 1, borderColor: c.border, backgroundColor: c.bg, paddingHorizontal: 16, paddingVertical: 12, fontSize: 13, color: c.text }} />
                      </View>
                      <View style={{ flex: 1, gap: 6 }}>
                        <Text style={{ fontSize: 11, fontWeight: "700", letterSpacing: 1, color: c.muted }}>EMAIL</Text>
                        <TextInput value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="your@email.com" placeholderTextColor={c.muted + "60"} style={{ borderRadius: 12, borderWidth: 1, borderColor: c.border, backgroundColor: c.bg, paddingHorizontal: 16, paddingVertical: 12, fontSize: 13, color: c.text }} />
                      </View>
                    </View>
                    <View style={{ gap: 6 }}>
                      <Text style={{ fontSize: 11, fontWeight: "700", letterSpacing: 1, color: c.muted }}>SUBJECT</Text>
                      <TextInput value={subject} onChangeText={setSubject} placeholder="Subject" placeholderTextColor={c.muted + "60"} style={{ borderRadius: 12, borderWidth: 1, borderColor: c.border, backgroundColor: c.bg, paddingHorizontal: 16, paddingVertical: 12, fontSize: 13, color: c.text }} />
                    </View>
                    <View style={{ gap: 6 }}>
                      <Text style={{ fontSize: 11, fontWeight: "700", letterSpacing: 1, color: c.muted }}>MESSAGE</Text>
                      <TextInput value={message} onChangeText={setMessage} multiline numberOfLines={5} placeholder="Your message" placeholderTextColor={c.muted + "60"} style={{ borderRadius: 12, borderWidth: 1, borderColor: c.border, backgroundColor: c.bg, paddingHorizontal: 16, paddingVertical: 12, fontSize: 13, color: c.text, minHeight: 100, textAlignVertical: "top" }} />
                    </View>
                    <Pressable onPress={handleSubmit} disabled={sending} style={{ alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 12, backgroundColor: c.accent, paddingHorizontal: 24, paddingVertical: 12, opacity: sending ? 0.5 : 1 }}>
                      <Text style={{ fontSize: 16 }}>📨</Text>
                      <Text style={{ fontSize: 13, fontWeight: "600", color: "#fff" }}>{sending ? "Sending..." : "Send Message"}</Text>
                    </Pressable>
                  </motion.View>
                )}
              </AnimatePresence>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
