import { useEffect, useState, useMemo, useCallback } from "react"
import { View, Text, Pressable, ScrollView, Image, ActivityIndicator, Alert } from "react-native"
import { useRouter } from "expo-router"
import { motion, AnimatePresence } from "@/lib/motion"
import PlantDetailsModal from "@/components/PlantDetailsModal"
import { useTheme } from "@/components/ThemeProvider"
import { themeColors } from "@/lib/colors"
import { SunIcon, WaterDrop, Sprout } from "@/lib/icons"

export default function MyPlantsPage() {
  const [plants, setPlants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPlant, setSelectedPlant] = useState<any>(null)
  const { dark } = useTheme()
  const c = useMemo(() => (dark ? themeColors.dark : themeColors.light), [dark])
  const router = useRouter()
  const API = process.env.EXPO_PUBLIC_API_URL

  const fetchPlants = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(`${API}/user/plants`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Failed to fetch plants")
        setPlants([])
        return
      }
      setPlants(data.data || data["hydra:member"] || [])
    } catch {
      setError("An error occurred while fetching plants.")
      setPlants([])
    } finally {
      setLoading(false)
    }
  }, [API])

  useEffect(() => { fetchPlants() }, [fetchPlants])

  const handleDelete = async (id: number) => {
    Alert.alert("Delete Plant", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: async () => {
          try {
            const res = await fetch(`${API}/user/plant/${id}`, { method: "DELETE" })
            if (!res.ok) {
              const data = await res.json().catch(() => ({}))
              setError(data.error || "Failed to delete plant")
              return
            }
            fetchPlants()
          } catch {
            setError("An error occurred while deleting the plant.")
          }
        },
      },
    ])
  }

  if (loading) return <View style={{ flex: 1, backgroundColor: c.bg, alignItems: "center", justifyContent: "center" }}><ActivityIndicator size="small" color={c.accent} /></View>
  if (error) return <View style={{ flex: 1, backgroundColor: c.bg, padding: 24 }}><Text style={{ color: "#ef4444" }}>Error: {error}</Text></View>

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.bg }} contentContainerStyle={{ padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: "600", color: c.text, marginBottom: 20 }}>My Plants</Text>

      {plants.length === 0 ? (
        <Text style={{ color: c.muted }}>No plants added yet. Add one now!</Text>
      ) : (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
          {plants.map((item: any, index: number) => {
            const p = item.plant || item
            const wateringDate = item.nextWateringAt ? new Date(item.nextWateringAt) : null
            const needsWater = wateringDate && wateringDate < new Date()
            return (
              <motion.View
                key={item.id}
                initial="hidden"
                animate="visible"
                style={{
                  width: "47%",
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: c.border,
                  backgroundColor: c.surface,
                  overflow: "hidden",
                }}
              >
                <View style={{ height: 100, backgroundColor: c.bg, alignItems: "center", justifyContent: "center" }}>
                  <Sprout color={c.muted + "60"} size={24} />
                </View>
                <View style={{ padding: 16, gap: 8 }}>
                  <Text style={{ fontSize: 16, fontWeight: "600", color: c.text }} numberOfLines={1}>
                    {p?.common_name || "Unknown"}
                  </Text>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                      <SunIcon color={c.muted} size={12} />
                      <Text style={{ fontSize: 11, color: c.muted }} numberOfLines={1}>
                        {Array.isArray(p?.sunlight) ? p.sunlight[0] : p?.sunlight || "N/A"}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <WaterDrop color={c.muted} size={12} />
                    <Text style={{ fontSize: 11, color: c.muted }}>{p?.watering || "N/A"}</Text>
                  </View>
                  {wateringDate && (
                    <Text style={{ fontSize: 11, fontWeight: "700", color: needsWater ? "#ef4444" : c.accent, backgroundColor: needsWater ? "#ef444410" : c.accent + "18", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: "flex-start" }}>
                      {wateringDate.toLocaleDateString()}
                    </Text>
                  )}
                  <View style={{ gap: 6, marginTop: 8 }}>
                    <Pressable onPress={() => setSelectedPlant(p)} style={{ paddingVertical: 8, borderRadius: 12, backgroundColor: c.accent + "18", alignItems: "center" }}>
                      <Text style={{ fontSize: 13, fontWeight: "700", color: c.accent }}>View Details</Text>
                    </Pressable>
                    <Pressable onPress={() => handleDelete(item.id)} style={{ paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: "#ef444420", alignItems: "center" }}>
                      <Text style={{ fontSize: 13, fontWeight: "700", color: "#ef4444" }}>Remove</Text>
                    </Pressable>
                  </View>
                </View>
              </motion.View>
            )
          })}
        </View>
      )}

      <AnimatePresence>
        {selectedPlant && (
          <PlantDetailsModal plant={selectedPlant} onClose={() => setSelectedPlant(null)} />
        )}
      </AnimatePresence>
    </ScrollView>
  )
}
