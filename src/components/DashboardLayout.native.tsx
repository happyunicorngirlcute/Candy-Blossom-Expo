import { useEffect, useState, useMemo, useRef } from "react"
import { View, Text, Pressable, ScrollView, Dimensions, Platform } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { usePathname, useRouter, Link } from "expo-router"
import { useAuth } from "@/components/AuthProvider"
import { useTheme } from "@/components/ThemeProvider"
import { motion, AnimatePresence } from "@/lib/motion"
import { themeColors } from "@/lib/colors"

let notifShown = false

function SunIconSmall() {
  return <Text style={{ fontSize: 16 }}>☀️</Text>
}

function WaterIcon() {
  return <Text style={{ fontSize: 16 }}>💧</Text>
}

function IconWrapper({ children }: { children: React.ReactNode }) {
  return <View style={{ width: 16, height: 16, alignItems: "center", justifyContent: "center", opacity: 0.7 }}>{children}</View>
}

function SmallIcon({ type }: { type: "grid" | "plus" | "leaf" | "settings" }) {
  const symbols: Record<string, string> = { grid: "▦", plus: "+", leaf: "♣", settings: "⚙" }
  return <Text style={{ fontSize: 12, color: "inherit" }}>{symbols[type] || "•"}</Text>
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const { dark } = useTheme()
  const c = useMemo(() => (dark ? themeColors.dark : themeColors.light), [dark])
  const [notification, setNotification] = useState<{ type?: string; plantName: string; message?: string } | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const insets = useSafeAreaInsets()

  const API = process.env.EXPO_PUBLIC_API_URL
  const protectedRoutes = ["/dashboard"]
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))

  useEffect(() => {
    if (!loading && isProtected && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isProtected, isAuthenticated, loading, router])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const checkNotifications = async () => {
      if (!isAuthenticated || !isProtected) return
      if (notifShown) return

      try {
        const res = await fetch(`${API}/user/plants`)
        const data = await res.json()
        const plants = data.data || []
        const now = new Date()
        const currentHour = now.getHours()
        const isMorning = currentHour >= 6 && currentHour < 11

        let sunNotif: any = null
        if (isMorning) {
          const plantNeedsSun = plants.find((item: any) => {
            const sunlight = Array.isArray(item.plant.sunlight) ? item.plant.sunlight.join(" ").toLowerCase() : (item.plant.sunlight || "").toLowerCase()
            return sunlight.includes("full sun") || sunlight.includes("part shade")
          })
          if (plantNeedsSun) {
            sunNotif = {
              type: "sun",
              plantName: plantNeedsSun.plant.common_name,
              message: "It's a beautiful morning! Make sure your plant is getting its morning sun exposure.",
            }
          }
        }

        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        const tomorrowStr = tomorrow.toISOString().split("T")[0]

        const plantToWater = plants.find((item: any) => {
          if (!item.nextWateringAt) return false
          return item.nextWateringAt.startsWith(tomorrowStr)
        })

        if (plantToWater) {
          setNotification({ type: "watering", plantName: plantToWater.plant.common_name, message: `You are 1 day away from watering your ${plantToWater.plant.common_name}. Make sure you have enough water ready!` })
          notifShown = true
        } else if (sunNotif) {
          setNotification(sunNotif)
          notifShown = true
        }
      } catch {}
    }

    if (!loading && isAuthenticated) checkNotifications()
  }, [isAuthenticated, isProtected, loading, API])

  if (loading) return null

  const isActive = (path: string) => pathname === path || (path !== "/dashboard" && pathname.startsWith(path))

  const navItem = (path: string, icon: React.ReactNode, label: string) => {
    const active = isActive(path)
    return (
      <Link href={path} key={path} asChild>
        <Pressable style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, backgroundColor: active ? c.border : "transparent" }}>
          <View style={{ width: 16, height: 16, alignItems: "center", justifyContent: "center", opacity: 0.7 }}>
            <Text style={{ fontSize: 12, color: active ? c.text : c.muted }}>{icon}</Text>
          </View>
          <Text style={{ fontSize: 13, fontWeight: "400", color: active ? c.text : c.muted }}>{label}</Text>
        </Pressable>
      </Link>
    )
  }

  const sidebarContent = (
    <View style={{ padding: 16, gap: 5 }}>
      <View style={{ flexDirection: "column", gap: 4 }}>
        <View style={{ flexDirection: "column", gap: 4 }}>
          {navItem("/dashboard", "▦", "Overview")}
          {navItem("/dashboard/add-plant", "+", "Add a plant")}
        </View>
      </View>
      <View style={{ marginTop: 16 }}>
        <Text style={{ paddingHorizontal: 10, marginBottom: 8, fontSize: 9, fontWeight: "800", letterSpacing: 2, color: c.muted + "80" }}>
          COLLECTION
        </Text>
        <View style={{ flexDirection: "column", gap: 4 }}>
          {navItem("/dashboard/plants", "♣", "My Plants")}
          {navItem("/dashboard/settings", "⚙", "Settings")}
        </View>
      </View>
    </View>
  )

  return (
    <View style={{ flex: 1, flexDirection: "row", backgroundColor: c.bg }}>
      <AnimatePresence>
        {notification && (
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, alignItems: "center", justifyContent: "center", padding: 16 }}>
            <Pressable onPress={() => setNotification(null)} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.4)" }} />
            <motion.View
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              style={{ width: "100%", maxWidth: 360, borderRadius: 16, borderWidth: 1, borderColor: c.border, backgroundColor: c.surface, padding: 32, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 }}
            >
              <View style={{ marginBottom: 16 }}>{notification.type === "sun" ? <SunIconSmall /> : <WaterIcon />}</View>
              <Text style={{ fontSize: 18, fontWeight: "700", color: c.text, marginBottom: 16 }}>
                {notification.type === "sun" ? "Sun Exposure Alert" : "Time to get ready!"}
              </Text>
              <Text style={{ fontSize: 14, opacity: 0.7, textAlign: "center", lineHeight: 22, color: c.text }}>{notification.message}</Text>
              <Pressable
                onPress={() => setNotification(null)}
                style={{ marginTop: 32, width: "100%", borderRadius: 999, paddingVertical: 8, alignItems: "center", backgroundColor: notification.type === "sun" ? "#f97316" : c.accent }}
              >
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#fff" }}>Got it</Text>
              </Pressable>
            </motion.View>
          </View>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isProtected && isAuthenticated && mobileMenuOpen && (
          <>
            <Pressable key="mobile-backdrop" onPress={() => setMobileMenuOpen(false)} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 60, backgroundColor: "rgba(0,0,0,0.5)" }} />
            <motion.View
              key="mobile-sidebar"
              initial={{ x: -Dimensions.get("window").width }}
              animate={{ x: 0 }}
              exit={{ x: -Dimensions.get("window").width }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              style={{ position: "absolute", top: 0, left: 0, bottom: 0, zIndex: 70, width: 256, borderRightWidth: 1, borderRightColor: c.border, backgroundColor: c.surface, paddingTop: insets.top }}
            >
              <View style={{ flexDirection: "row", justifyContent: "flex-end", padding: 16 }}>
                <Pressable onPress={() => setMobileMenuOpen(false)} style={{ width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: 16, color: c.muted }}>✕</Text>
                </Pressable>
              </View>
              {sidebarContent}
            </motion.View>
          </>
        )}
      </AnimatePresence>

      {isProtected && isAuthenticated && (
        <View style={{ width: 256, borderRightWidth: 1, borderRightColor: c.border, backgroundColor: c.surface, paddingTop: insets.top }}>
          {sidebarContent}
        </View>
      )}

      {isProtected && isAuthenticated && !mobileMenuOpen && (
        <Pressable
          onPress={() => setMobileMenuOpen(true)}
          style={{ position: "absolute", top: insets.top + 8, left: 8, zIndex: 50, width: 40, height: 40, borderRadius: 12, borderWidth: 1, borderColor: c.border, backgroundColor: c.surface, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ fontSize: 18, color: c.text }}>☰</Text>
        </Pressable>
      )}

      <View style={{ flex: 1, flexDirection: "column" }}>
        {children}
      </View>
    </View>
  )
}
