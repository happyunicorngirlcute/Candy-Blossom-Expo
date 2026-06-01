import { useEffect, useState, useMemo, Suspense } from "react"
import { View, Text, ActivityIndicator } from "react-native"
import { useSearchParams, useRouter } from "expo-router"
import { motion } from "@/lib/motion"
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

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { dark } = useTheme()
  const c = useMemo(() => (dark ? themeColors.dark : themeColors.light), [dark])
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Verifying your email...")

  useEffect(() => {
    const token = searchParams.get("token")
    if (!token) {
      setStatus("error")
      setMessage("I need a token to verify your email.")
      return
    }

    const verify = async () => {
      try {
        const res = await fetchBackend(`/verify-email?token=${token}`)
        const data = await res.json()
        if (res.ok) {
          setStatus("success")
          setMessage(data.message || "Email verified successfully!")
          setTimeout(() => router.push(`/auth/register/password?email=${encodeURIComponent(data.email)}`), 2000)
        } else {
          setStatus("error")
          setMessage(data.error || "Verification failed.")
        }
      } catch {
        setStatus("error")
        setMessage("Cannot connect to backend.")
      }
    }
    verify()
  }, [searchParams, router])

  return (
    <View style={{ flex: 1, backgroundColor: c.bg, alignItems: "center", justifyContent: "center" }}>
      <motion.View variants={containerVariants} initial="hidden" animate="visible" style={{ alignItems: "center", gap: 16, paddingHorizontal: 24 }}>
        {status === "loading" && <ActivityIndicator size="large" color={c.accent} />}
        <Text style={{ fontSize: 24, fontWeight: "300", textAlign: "center", color: c.text }}>
          {status === "loading" && "Verifying..."}
          {status === "success" && "Verified! ✓"}
          {status === "error" && "Give it a moment?"}
        </Text>
        {message && <Text style={{ fontSize: 14, color: c.muted, textAlign: "center" }}>{message}</Text>}
      </motion.View>
    </View>
  )
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}><ActivityIndicator size="small" /></View>}>
      <VerifyEmailContent />
    </Suspense>
  )
}
