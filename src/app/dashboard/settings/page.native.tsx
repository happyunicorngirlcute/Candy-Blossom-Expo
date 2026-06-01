import { useState, useEffect, useMemo } from "react"
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from "react-native"
import { useRouter } from "expo-router"
import { useAuth } from "@/components/AuthProvider"
import { motion } from "@/lib/motion"
import { fetchBackend } from "@/lib/fetchApi"
import { useTheme } from "@/components/ThemeProvider"
import { themeColors } from "@/lib/colors"

export default function SettingsPage() {
  const router = useRouter()
  const { dark } = useTheme()
  const c = useMemo(() => (dark ? themeColors.dark : themeColors.light), [dark])
  const { logout } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [profileSaved, setProfileSaved] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [profileError, setProfileError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBackend("/user/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.name) setName(data.name)
        if (data.email) setEmail(data.email)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleProfileSubmit = async () => {
    setProfileError("")
    setProfileSaved(false)
    try {
      const res = await fetchBackend("/user/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || err.message || "Failed to update profile")
      }
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 2000)
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Failed to update profile")
    }
  }

  const handlePasswordSubmit = async () => {
    setPasswordError("")
    setPasswordSaved(false)
    try {
      const res = await fetchBackend("/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || err.message || "Failed to update password")
      }
      setPasswordSaved(true)
      setCurrentPassword("")
      setNewPassword("")
      setTimeout(() => setPasswordSaved(false), 2000)
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Failed to update password")
    }
  }

  const inputStyle = {
    width: "100%" as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.bg,
    fontSize: 13,
    color: c.text,
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.bg }} contentContainerStyle={{ padding: 24, maxWidth: 500 }}>
      <motion.View initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Text style={{ fontSize: 22, fontWeight: "600", letterSpacing: -0.3, color: c.text }}>Settings</Text>
        <Text style={{ fontSize: 13, color: c.muted + "b0", marginTop: 4 }}>Manage your profile and account preferences.</Text>
      </motion.View>

      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 60 }}>
          <ActivityIndicator size="small" color={c.accent} />
        </View>
      ) : (
        <View style={{ marginTop: 24, gap: 20 }}>
          <View style={{ borderRadius: 16, borderWidth: 1, borderColor: c.border, backgroundColor: c.surface, overflow: "hidden" }}>
            <View style={{ paddingHorizontal: 24, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: c.border }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: c.text }}>Profile Information</Text>
              <Text style={{ fontSize: 12, color: c.muted + "99", marginTop: 2 }}>Update your name and email address.</Text>
            </View>
            <View style={{ padding: 24, gap: 16 }}>
              <View style={{ gap: 6 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: c.muted }}>Name</Text>
                <TextInput value={name} onChangeText={setName} style={inputStyle} />
              </View>
              <View style={{ gap: 6 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: c.muted }}>Email</Text>
                <TextInput value={email} onChangeText={setEmail} keyboardType="email-address" style={inputStyle} />
              </View>
              {!!profileError && <Text style={{ fontSize: 12, color: "#ef4444" }}>{profileError}</Text>}
              <Pressable onPress={handleProfileSubmit} style={{ alignSelf: "flex-start", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, backgroundColor: c.accent }}>
                <Text style={{ color: "#fff", fontSize: 13, fontWeight: "600" }}>
                  {profileSaved ? "✓ Saved" : "Save Changes"}
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={{ borderRadius: 16, borderWidth: 1, borderColor: c.border, backgroundColor: c.surface, overflow: "hidden" }}>
            <View style={{ paddingHorizontal: 24, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: c.border }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: c.text }}>Security</Text>
              <Text style={{ fontSize: 12, color: c.muted + "99", marginTop: 2 }}>Change your password.</Text>
            </View>
            <View style={{ padding: 24, gap: 16 }}>
              <View style={{ gap: 6 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: c.muted }}>Current Password</Text>
                <TextInput value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry style={inputStyle} />
              </View>
              <View style={{ gap: 6 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: c.muted }}>New Password</Text>
                <TextInput value={newPassword} onChangeText={setNewPassword} secureTextEntry style={inputStyle} />
              </View>
              {!!passwordError && <Text style={{ fontSize: 12, color: "#ef4444" }}>{passwordError}</Text>}
              <Pressable onPress={handlePasswordSubmit} style={{ alignSelf: "flex-start", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, backgroundColor: c.accent }}>
                <Text style={{ color: "#fff", fontSize: 13, fontWeight: "600" }}>
                  {passwordSaved ? "✓ Password Updated" : "Update Password"}
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={{ borderRadius: 16, borderWidth: 1, borderColor: "#ef444420", backgroundColor: "#ef444408", overflow: "hidden" }}>
            <View style={{ paddingHorizontal: 24, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: "#ef444410" }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#ef4444" }}>Danger Zone</Text>
              <Text style={{ fontSize: 12, color: "#ef444480", marginTop: 2 }}>Irreversible account actions.</Text>
            </View>
            <View style={{ padding: 24, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View>
                <Text style={{ fontSize: 14, fontWeight: "500", color: c.text }}>Log out</Text>
                <Text style={{ fontSize: 12, color: c.muted + "99" }}>Sign out and return to the home page.</Text>
              </View>
              <Pressable onPress={() => { logout(); router.push("/") }} style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: "#ef444440" }}>
                <Text style={{ fontSize: 13, fontWeight: "600", color: "#ef4444" }}>Log out</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  )
}
