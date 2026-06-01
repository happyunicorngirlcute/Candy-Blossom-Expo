import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  Dimensions,
  Platform,
  useWindowDimensions,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Link, useRouter, usePathname } from "expo-router"
import { AnimatePresence, motion } from "@/lib/motion"
import { useTheme } from "@/components/ThemeProvider"
import { useAuth } from "@/components/AuthProvider"
import { themeColors } from "@/lib/colors"
import {
  SunIcon, MoonIcon, ChevronDown, ChevronUp,
  Hamburger, Close,
} from "@/lib/icons"

const products = [
  { label: "Uploading", title: "Name me your plants, I will know how to take care of it" },
  { label: "Watering", title: "Get notified when its time to water your plants" },
  { label: "Sun", title: "Know when to leave your plants in the sun" },
  { label: "Growing", title: "Know when and how your plant grows" },
  { label: "Weather", title: "Updated on the weather needs for your plants" },
  { label: "Application", title: "All of this in our website, or in our application" },
]

const panelVariants = {
  hidden: { opacity: 0, y: -6, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    opacity: 0,
    y: -4,
    scale: 0.98,
    transition: { duration: 0.12, ease: [0.4, 0, 1, 1] as const },
  },
}

const MOBILE_BREAKPOINT = 768

export default function HeaderDropdown() {
  const router = useRouter()
  const pathname = usePathname()
  const isDashboard = pathname.startsWith("/dashboard")
  const [open, setOpen] = useState(false)
  const [showPricingPopup, setShowPricingPopup] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [drawerMegaOpen, setDrawerMegaOpen] = useState(false)
  const { dark, toggle } = useTheme()
  const { isAuthenticated } = useAuth()
  const insets = useSafeAreaInsets()
  const { width: screenWidth } = useWindowDimensions()
  const isMobile = screenWidth < MOBILE_BREAKPOINT

  const colors = useMemo(() => (dark ? themeColors.dark : themeColors.light), [dark])
  const c = colors

  const closeDrawer = useCallback(() => setMobileNavOpen(false), [])

  const navItems = [
    { label: "Source", href: "/source" as const },
    { label: "Docs", href: "/docs" as const },
    { label: "Pricing", onClick: () => { setShowPricingPopup(true); closeDrawer() } },
    { label: "Contact", href: "/contact" as const },
  ]

  const brand = (
    <Pressable onPress={() => { router.push("/"); closeDrawer() }}>
      <Text style={{ fontWeight: "700", fontSize: 15, color: c.text }}>Candy Blossom</Text>
    </Pressable>
  )

  const themeToggle = (
    <Pressable
      onPress={toggle}
      style={{ width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" }}
    >
      {dark ? <MoonIcon color={c.muted} size={16} /> : <SunIcon color={c.muted} size={16} />}
    </Pressable>
  )

  const desktopNavItems = (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      {navItems.map((item) =>
        "onClick" in item ? (
          <Pressable key={item.label} onPress={item.onClick} style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
            <Text style={{ fontSize: 13, color: c.muted }}>{item.label}</Text>
          </Pressable>
        ) : (
          <Link key={item.label} href={item.href!} asChild>
            <Pressable style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
              <Text style={{ fontSize: 13, color: c.muted }}>{item.label}</Text>
            </Pressable>
          </Link>
        )
      )}

      <View style={{ position: "relative" }}>
        <Pressable
          onPress={() => setOpen(!open)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 999,
            backgroundColor: open ? c.text : "transparent",
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: "500", color: open ? c.bg : c.text }}>
            What I can do?
          </Text>
          <motion.View animate={{ rotate: open ? "180deg" : "0deg" }} transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as any }}>
            <ChevronDown color={open && !dark ? "#ffffff" : c.muted} size={14} />
          </motion.View>
        </Pressable>

        <AnimatePresence>
          {open && (
            <motion.View
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                position: "absolute",
                top: "100%",
                marginTop: 8,
                width: 680,
                maxWidth: screenWidth - 32,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: c.border,
                backgroundColor: c.surface,
                overflow: "hidden",
                alignSelf: "center",
                left: -300,
              }}
            >
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {products.map((item, i) => (
                  <Link key={item.label} href={`/features/${item.label.toLowerCase()}`} asChild>
                    <Pressable
                      style={{
                        width: "33.33%" as any,
                        padding: 16,
                        borderRightWidth: i % 3 !== 2 ? 1 : 0,
                        borderBottomWidth: i < 3 ? 1 : 0,
                        borderColor: c.border,
                      }}
                    >
                      <View>
                        <Text style={{ fontSize: 13, color: c.muted, marginBottom: 4 }}>{item.label}</Text>
                        <Text style={{ fontSize: 14, fontWeight: "600", color: c.text, lineHeight: 20 }}>{item.title}</Text>
                      </View>
                    </Pressable>
                  </Link>
                ))}
              </View>
            </motion.View>
          )}
        </AnimatePresence>
      </View>

      <View style={{ width: 1, height: 16, backgroundColor: c.border }} />

      {themeToggle}

      {isAuthenticated ? (
        <Pressable
          onPress={() => router.push("/dashboard")}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: c.border,
            backgroundColor: dark ? "#FFFFFF" : "#F2B5CE",
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: "500", color: dark ? "#000000" : "#FFFFFF" }}>Dashboard</Text>
        </Pressable>
      ) : !isDashboard ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Pressable onPress={() => router.push("/auth/login")} style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
            <Text style={{ fontSize: 13, color: c.muted }}>Log in</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/auth/register")}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: c.border,
              backgroundColor: dark ? "#FFFFFF" : "#F2B5CE",
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: "500", color: dark ? "#000000" : "#FFFFFF" }}>Sign up</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  )

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        borderBottomWidth: 1,
        borderBottomColor: c.border,
        backgroundColor: c.bg,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingTop: insets.top + 8,
          paddingBottom: 12,
        }}
      >
        {brand}

        {isMobile ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            {themeToggle}
            <Pressable onPress={() => setMobileNavOpen(!mobileNavOpen)} style={{ width: 32, height: 32, alignItems: "center", justifyContent: "center" }}>
              {mobileNavOpen ? <Close color={c.muted} size={20} /> : <Hamburger color={c.muted} size={20} />}
            </Pressable>
          </View>
        ) : (
          desktopNavItems
        )}
      </View>

      <AnimatePresence>
        {mobileNavOpen && isMobile && (
          <>
            <Pressable onPress={closeDrawer} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)" }} />
            <motion.View
              initial={{ x: screenWidth }}
              animate={{ x: 0 }}
              exit={{ x: screenWidth }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                width: 280,
                borderLeftWidth: 1,
                borderLeftColor: c.border,
                backgroundColor: c.surface,
                paddingTop: insets.top + 60,
                paddingHorizontal: 20,
              }}
            >
              <ScrollView>
                <View style={{ gap: 20 }}>
                  {navItems.map((item) =>
                    "onClick" in item ? (
                      <Pressable key={item.label} onPress={item.onClick}>
                        <Text style={{ fontSize: 14, color: c.muted, paddingVertical: 6 }}>{item.label}</Text>
                      </Pressable>
                    ) : (
                      <Link key={item.label} href={item.href!} onPress={closeDrawer} asChild>
                        <Pressable>
                          <Text style={{ fontSize: 14, color: c.muted, paddingVertical: 6 }}>{item.label}</Text>
                        </Pressable>
                      </Link>
                    )
                  )}

                  <Pressable
                    onPress={() => setDrawerMegaOpen(!drawerMegaOpen)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingVertical: 6,
                    }}
                  >
                    <Text style={{ fontSize: 14, color: c.muted }}>What I can do?</Text>
                    {drawerMegaOpen ? <ChevronUp color={c.muted} size={14} /> : <ChevronDown color={c.muted} size={14} />}
                  </Pressable>
                  <AnimatePresence>
                    {drawerMegaOpen && (
                      <motion.View
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto" as any, opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ overflow: "hidden" }}
                      >
                        <View style={{ gap: 12, paddingLeft: 12 }}>
                          {products.map((item) => (
                            <Link key={item.label} href={`/features/${item.label.toLowerCase()}`} onPress={closeDrawer} asChild>
                              <Pressable>
                                <Text style={{ fontSize: 14, color: c.text, paddingVertical: 4 }}>{item.label}</Text>
                                <Text style={{ fontSize: 12, color: c.muted }}>{item.title}</Text>
                              </Pressable>
                            </Link>
                          ))}
                        </View>
                      </motion.View>
                    )}
                  </AnimatePresence>

                  <View style={{ height: 1, backgroundColor: c.border }} />
                  <Link href="/docs" onPress={closeDrawer} asChild>
                    <Pressable>
                      <Text style={{ fontSize: 14, color: c.muted, paddingVertical: 6 }}>Docs</Text>
                    </Pressable>
                  </Link>
                  <View style={{ height: 1, backgroundColor: c.border }} />

                  {isAuthenticated ? (
                    <Pressable
                      onPress={() => { router.push("/dashboard"); closeDrawer() }}
                      style={{
                        paddingVertical: 8,
                        borderRadius: 999,
                        borderWidth: 1,
                        borderColor: c.border,
                        backgroundColor: dark ? "#FFFFFF" : "#F2B5CE",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontSize: 14, fontWeight: "500", color: dark ? "#000000" : "#FFFFFF" }}>Dashboard</Text>
                    </Pressable>
                  ) : !isDashboard ? (
                    <View style={{ gap: 10 }}>
                      <Pressable onPress={() => { router.push("/auth/login"); closeDrawer() }} style={{ paddingVertical: 8, alignItems: "center" }}>
                        <Text style={{ fontSize: 14, color: c.muted }}>Log in</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => { router.push("/auth/register"); closeDrawer() }}
                        style={{
                          paddingVertical: 8,
                          borderRadius: 999,
                          borderWidth: 1,
                          borderColor: c.border,
                          backgroundColor: dark ? "#FFFFFF" : "#F2B5CE",
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ fontSize: 14, fontWeight: "500", color: dark ? "#000000" : "#FFFFFF" }}>Sign up</Text>
                      </Pressable>
                    </View>
                  ) : null}
                </View>
              </ScrollView>
            </motion.View>
          </>
        )}
      </AnimatePresence>

      <Modal visible={showPricingPopup} transparent animationType="none">
        <Pressable style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 16 }} onPress={() => setShowPricingPopup(false)}>
          <motion.View
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: "rgba(0,0,0,0.2)",
            }}
          />
          <motion.View
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            style={{
              width: "100%",
              maxWidth: 320,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: c.border,
              backgroundColor: c.surface,
              padding: 32,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "700", color: c.text, marginBottom: 24 }}>It's completely free!</Text>
            <Text style={{ fontSize: 14, opacity: 0.6, textAlign: "center", lineHeight: 22, color: c.text }}>
              Candy Blossom's website and application are 100% free to use.{"\n"}
              Enjoy taking care of your plants without any cost
            </Text>
            <Pressable
              onPress={() => setShowPricingPopup(false)}
              style={{
                marginTop: 32,
                width: "100%",
                paddingVertical: 8,
                borderRadius: 999,
                backgroundColor: dark ? "#fff" : "#F2B5CE",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: "600", color: dark ? "#000" : "#fff" }}>Got it</Text>
            </Pressable>
          </motion.View>
        </Pressable>
      </Modal>
    </View>
  )
}
