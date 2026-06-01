import { useState, useMemo, Suspense } from "react"
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useLocalSearchParams } from "expo-router"
import { motion } from "@/lib/motion"
import { useTheme } from "@/components/ThemeProvider"
import { themeColors } from "@/lib/colors"
import { WaterDrop, SunIcon, Cloud, Search, Pencil, Grid } from "@/lib/icons"

const iconComponents: Record<string, React.FC<{ color: string; size: number }>> = {
  WaterDrop, SunIcon, Cloud, Search, Pencil, Grid,
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}

function Hero({ c }: { c: typeof themeColors.light }) {
  return (
    <View style={{ minHeight: Dimensions.get("window").height, alignItems: "center", justifyContent: "center", paddingHorizontal: 24, paddingTop: 120, paddingBottom: 60 }}>
      <View style={{ maxWidth: 600, alignItems: "center" }}>
        <motion.View variants={itemVariants} style={{ alignItems: "center", gap: 20 }}>
          <Text style={{ fontSize: 40, fontWeight: "600", letterSpacing: -0.5, textAlign: "center", lineHeight: 44, color: c.text }}>
            Your plants,{"\n"}
            <Text style={{ color: c.accent }}>beautifully</Text> cared for
          </Text>
          <Text style={{ fontSize: 17, lineHeight: 24, textAlign: "center", color: c.muted, maxWidth: 400 }}>
            Candy Blossom gives you tailored instructions for every plant in your home.
          </Text>
        </motion.View>
      </View>
    </View>
  )
}

const features = [
  { title: "Smart Watering", description: "Get notified exactly when your plants need water.", color: "#3b82f6", icon: "WaterDrop" },
  { title: "Sunlight Tracking", description: "Know when to move your plants into the sun or shade.", color: "#f59e0b", icon: "SunIcon" },
  { title: "Weather Integration", description: "Real-time weather adjusts care recommendations.", color: "#0ea5e9", icon: "Cloud" },
  { title: "Plant Identification", description: "Upload a photo to identify any plant species.", color: "#10b981", icon: "Search" },
  { title: "Care Notes", description: "Log observations and track growth for each plant.", color: "#a855f7", icon: "Pencil" },
  { title: "Dashboard Overview", description: "See all plants with hydration scores and schedules.", color: "#ec4899", icon: "Grid" },
]

function HomeContent() {
  const { dark } = useTheme()
  const c = useMemo(() => (dark ? themeColors.dark : themeColors.light), [dark])
  const insets = useSafeAreaInsets()
  const { registered } = useLocalSearchParams<{ registered?: string }>()

  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const API = process.env.EXPO_PUBLIC_API_URL || ""

  const handleSearch = async () => {
    if (!searchTerm.trim()) return
    setSearching(true)
    setSearchError(null)
    try {
      const res = await fetch(`${API}/api/plants/search/${encodeURIComponent(searchTerm)}/1`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Search failed")
      setSearchResults(data.data?.slice(0, 4) || [])
    } catch (err: any) {
      setSearchError(err.message)
    } finally {
      setSearching(false)
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
      <motion.View variants={containerVariants} initial="hidden" animate="visible">
        <Hero c={c} />

        <View style={{ paddingHorizontal: 24, paddingVertical: 80, backgroundColor: c.surface + "80" }}>
          <motion.View variants={fadeUp} style={{ maxWidth: 900, marginHorizontal: "auto" as any }}>
            <Text style={{ fontSize: 32, fontWeight: "600", textAlign: "center", marginBottom: 8, color: c.text }}>
              Your garden at a glance
            </Text>
            <Text style={{ textAlign: "center", color: c.muted, fontSize: 15, lineHeight: 22, maxWidth: 500, marginHorizontal: "auto" as any }}>
              A clean dashboard shows you everything you need to know about your plant collection.
            </Text>
          </motion.View>
        </View>

        <View style={{ paddingHorizontal: 24, paddingVertical: 80 }}>
          <motion.View variants={fadeUp} style={{ maxWidth: 900, marginHorizontal: "auto" as any, gap: 40 }}>
            <View>
              <Text style={{ fontSize: 32, fontWeight: "600", color: c.accent, marginBottom: 12 }}>Organized.</Text>
              <Text style={{ fontSize: 15, lineHeight: 22, color: c.muted }}>
                Browse the plants you added in your collection.
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: 12 }}>
              {[
                { name: "Monstera Deliciosa", image: "/images/Monstera.png" },
                { name: "Boston Fern", image: "/images/Boston-Fern.png" },
                { name: "Snake Plant", image: "/images/Snake-Plant.png" },
              ].map((p) => (
                <View key={p.name} style={{ flex: 1, borderRadius: 12, borderWidth: 1, borderColor: c.border, backgroundColor: c.surface, overflow: "hidden" }}>
                  <View style={{ height: 80, backgroundColor: c.surface }} />
                  <View style={{ padding: 10, gap: 4 }}>
                    <Text style={{ fontSize: 11, fontWeight: "600", color: c.text }} numberOfLines={1}>{p.name}</Text>
                  </View>
                </View>
              ))}
            </View>
          </motion.View>
        </View>

        <View style={{ paddingHorizontal: 24, paddingVertical: 80, backgroundColor: c.surface + "80" }}>
          <motion.View variants={fadeUp} style={{ maxWidth: 900, marginHorizontal: "auto" as any }}>
            <Text style={{ fontSize: 32, fontWeight: "600", color: c.text, marginBottom: 4 }}>
              Add plants to{"\n"}
              <Text style={{ color: c.accent }}>your collection.</Text>
            </Text>
            <Text style={{ fontSize: 15, lineHeight: 22, color: c.muted, marginBottom: 24 }}>
              Search plants you need, add them to your collection, and we'll handle the rest.
            </Text>

            <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
              <View style={{ flex: 1, borderWidth: 1, borderColor: c.border, borderRadius: 12, backgroundColor: c.bg }}>
                <TextInput
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                  onSubmitEditing={handleSearch}
                  placeholder="Search for a plant..."
                  placeholderTextColor={c.muted + "80"}
                  style={{ paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, color: c.text }}
                />
              </View>
              <Pressable
                onPress={handleSearch}
                disabled={searching}
                style={{ paddingHorizontal: 20, borderRadius: 12, backgroundColor: c.accent, alignItems: "center", justifyContent: "center", opacity: searching ? 0.5 : 1 }}
              >
                <Text style={{ color: "#fff", fontWeight: "600", fontSize: 13 }}>
                  {searching ? "..." : "Search"}
                </Text>
              </Pressable>
            </View>

            {searchError && (
              <View style={{ padding: 12, backgroundColor: "#ef444410", borderRadius: 10, borderWidth: 1, borderColor: "#ef444420", marginBottom: 12 }}>
                <Text style={{ color: "#ef4444", fontSize: 12 }}>{searchError}</Text>
              </View>
            )}

            {searchResults.length > 0 && (
              <View style={{ gap: 8 }}>
                {searchResults.map((plant: any) => (
                  <View key={plant.id} style={{ flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 12, borderWidth: 1, borderColor: c.border, backgroundColor: c.surface, gap: 12 }}>
                    <View style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: c.border }} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: "600", color: c.text }}>{plant.common_name}</Text>
                      {plant.scientific_name && (
                        <Text style={{ fontSize: 11, color: c.muted + "99", fontStyle: "italic" }}>{plant.scientific_name[0]}</Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </motion.View>
        </View>

        <View style={{ paddingHorizontal: 24, paddingVertical: 80 }}>
          <motion.View variants={fadeUp} style={{ maxWidth: 900, marginHorizontal: "auto" as any }}>
            <Text style={{ fontSize: 32, fontWeight: "600", color: c.accent, textAlign: "center", marginBottom: 60 }}>
              We know everything.
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
              {features.map((f, i) => (
                <motion.View
                  key={f.title}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    visible: { opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5 } },
                  }}
                  style={{
                    width: (Dimensions.get("window").width - 60) / 2 > 280 ? 280 : (Dimensions.get("window").width - 60) / 2,
                    flexGrow: 1,
                    padding: 20,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: c.border,
                    backgroundColor: c.surface,
                    gap: 8,
                  }}
                >
                  {(() => {
                    const IconComp = iconComponents[f.icon as keyof typeof iconComponents]
                    return IconComp ? <IconComp color={f.color} size={24} /> : null
                  })()}
                  <Text style={{ fontSize: 15, fontWeight: "600", color: c.text }}>{f.title}</Text>
                  <Text style={{ fontSize: 13, lineHeight: 18, color: c.muted }}>{f.description}</Text>
                </motion.View>
              ))}
            </View>
          </motion.View>
        </View>
      </motion.View>

      <View style={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: insets.bottom + 16, borderTopWidth: 1, borderTopColor: c.border }}>
        <Text style={{ fontSize: 11, color: c.muted + "80" }}>
          Made with care for plant lovers everywhere.
        </Text>
      </View>
    </ScrollView>
  )
}

export default function Home() {
  return (
    <Suspense fallback={
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="small" />
      </View>
    }>
      <HomeContent />
    </Suspense>
  )
}
