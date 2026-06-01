import { useState, useMemo, useCallback } from "react"
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator, Alert, Modal } from "react-native"
import { useRouter } from "expo-router"
import { motion, AnimatePresence } from "@/lib/motion"
import { useTheme } from "@/components/ThemeProvider"
import { themeColors } from "@/lib/colors"
import { SunIcon, WaterDrop, Sprout, ChevronLeft, ChevronRight } from "@/lib/icons"

type Plant = {
  id: number
  common_name: string
  watering_general_benchmark?: any
  default_image?: { original_url?: string; regular_url?: string; thumbnail?: string }
  sunlight?: string[]
  watering?: string
}

function AddPlantModal({ plant, API, onClose, colors: c }: { plant: Plant; API: string; onClose: () => void; colors: typeof themeColors.light }) {
  const [city, setCity] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleAdd = async () => {
    if (!city.trim()) {
      setError("City is required.")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API}/user/plant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plant_id: plant.id,
          city: city.trim(),
          nickname: plant.common_name,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || data.message || "Failed to add plant.")
        return
      }
      router.push("/dashboard/plants")
    } catch {
      setError("My server crashed!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal visible transparent animationType="fade">
      <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: 24 }}>
        <Pressable onPress={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 360, backgroundColor: c.surface, borderRadius: 16, padding: 24, gap: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: c.text }}>Add {plant.common_name}</Text>
          <TextInput
            value={city}
            onChangeText={setCity}
            placeholder="Enter your city"
            placeholderTextColor={c.muted + "60"}
            style={{ width: "100%", paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: c.border, fontSize: 14, color: c.text }}
          />
          {!!error && <Text style={{ color: "#ef4444", fontSize: 12 }}>{error}</Text>}
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Pressable onPress={onClose} style={{ flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: c.border, alignItems: "center" }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: c.muted }}>Cancel</Text>
            </Pressable>
            <Pressable onPress={handleAdd} disabled={loading} style={{ flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: c.accent, alignItems: "center", opacity: loading ? 0.5 : 1 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#fff" }}>{loading ? "Adding..." : "Add to Collection"}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

export default function AddPlantClient() {
  const { dark } = useTheme()
  const c = useMemo(() => (dark ? themeColors.dark : themeColors.light), [dark])
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<Plant[]>([])
  const [error, setError] = useState<string | null>(null)
  const [searching, setSearching] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [addingPlant, setAddingPlant] = useState<Plant | null>(null)
  const API = process.env.EXPO_PUBLIC_API_URL || ""

  const handleSearch = useCallback(async (page: number = 1) => {
    if (!searchTerm.trim()) return
    setSearching(true)
    setError(null)
    setResults([])
    setCurrentPage(page)
    try {
      const searchRes = await fetch(`${API}/api/plants/search/${encodeURIComponent(searchTerm)}/${page}`)
      const searchData = await searchRes.json()
      if (!searchRes.ok) throw new Error(searchData.error || "Search failed")
      setLastPage(searchData.last_page || 1)
      setTotal(searchData.total || 0)
      setResults(searchData.data || [])
    } catch (err: any) {
      setError(err.message || "Failed to search plants")
    } finally {
      setSearching(false)
    }
  }, [searchTerm, API])

  const inputStyle = {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.bg,
    fontSize: 14,
    color: c.text,
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.bg }} contentContainerStyle={{ padding: 24 }}>
      <View style={{ borderRadius: 16, borderWidth: 1, borderColor: c.border, backgroundColor: c.surface, padding: 24, marginBottom: 24 }}>
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <TextInput
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={() => handleSearch(1)}
            placeholder="Search for a plant..."
            placeholderTextColor={c.muted + "60"}
            style={inputStyle}
          />
          <Pressable
            onPress={() => handleSearch(1)}
            disabled={searching}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 12,
              backgroundColor: c.accent,
              alignItems: "center",
              justifyContent: "center",
              opacity: searching ? 0.5 : 1,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 13 }}>
              {searching ? "..." : "Search"}
            </Text>
          </Pressable>
        </View>
        {!!error && (
          <View style={{ marginTop: 12, padding: 12, backgroundColor: "#ef444410", borderRadius: 10, borderWidth: 1, borderColor: "#ef444420" }}>
            <Text style={{ color: "#ef4444", fontSize: 13 }}>{error}</Text>
          </View>
        )}
      </View>

      {total > 0 && !searching && (
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Text style={{ fontSize: 12, color: c.muted + "99" }}>
            <Text style={{ fontWeight: "700" }}>{total}</Text> results found
          </Text>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                <Pressable disabled={currentPage <= 1} onPress={() => handleSearch(currentPage - 1)} style={{ padding: 8, borderRadius: 8, borderWidth: 1, borderColor: c.border, opacity: currentPage <= 1 ? 0.3 : 1 }}>
              <ChevronLeft color={c.muted} size={14} />
            </Pressable>
            <Text style={{ fontSize: 12, fontWeight: "600", color: c.muted + "b0" }}>{currentPage} / {lastPage}</Text>
            <Pressable disabled={currentPage >= lastPage} onPress={() => handleSearch(currentPage + 1)} style={{ padding: 8, borderRadius: 8, borderWidth: 1, borderColor: c.border, opacity: currentPage >= lastPage ? 0.3 : 1 }}>
              <ChevronRight color={c.muted} size={14} />
            </Pressable>
          </View>
        </View>
      )}

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        {results.slice(0, 4).map((plant, i) => (
          <motion.View
            key={plant.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              width: "48%",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: c.border,
              backgroundColor: c.surface,
              overflow: "hidden",
            }}
          >
            <View style={{ height: 80, backgroundColor: c.bg, alignItems: "center", justifyContent: "center" }}>
              <Sprout color={c.muted + "60"} size={24} />
            </View>
            <View style={{ padding: 12, gap: 6 }}>
              <Text style={{ fontSize: 13, fontWeight: "600", color: c.text }} numberOfLines={1}>{plant.common_name}</Text>
              <View style={{ flexDirection: "row", gap: 4, flexWrap: "wrap" }}>
                {plant.sunlight && plant.sunlight.length > 0 && (
                  <View style={{ paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, backgroundColor: "#f59e0b18" }}>
                    <Text style={{ fontSize: 9, fontWeight: "700", color: "#f59e0b" }}><SunIcon color="#f59e0b" size={9} /> {plant.sunlight[0]}</Text>
                  </View>
                )}
                {plant.watering && (
                  <View style={{ paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, backgroundColor: "#3b82f618" }}>
                    <Text style={{ fontSize: 9, fontWeight: "700", color: "#3b82f6" }}><WaterDrop color="#3b82f6" size={9} /> {plant.watering}</Text>
                  </View>
                )}
              </View>
              <Pressable
                onPress={() => setAddingPlant(plant)}
                style={{ marginTop: 6, paddingVertical: 8, borderRadius: 10, backgroundColor: c.accent + "18", alignItems: "center" }}
              >
                <Text style={{ fontSize: 12, fontWeight: "700", color: c.accent }}>+ Add</Text>
              </Pressable>
            </View>
          </motion.View>
        ))}
        {!searching && results.length === 0 && !!searchTerm && (
          <View style={{ width: "100%", alignItems: "center", paddingVertical: 40, gap: 12 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: c.muted }}>No results found</Text>
            <Text style={{ fontSize: 12, color: c.muted + "80", textAlign: "center" }}>
              Try a different name or check the spelling.
            </Text>
          </View>
        )}
        {searching && (
          <View style={{ width: "100%", alignItems: "center", paddingVertical: 40 }}>
            <ActivityIndicator size="small" color={c.accent} />
            <Text style={{ fontSize: 12, color: c.muted + "80", marginTop: 8 }}>Searching plants...</Text>
          </View>
        )}
      </View>

      {total > 0 && !searching && (
        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 24 }}>
          <Pressable disabled={currentPage <= 1} onPress={() => handleSearch(currentPage - 1)} style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: c.border, opacity: currentPage <= 1 ? 0.3 : 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}><ChevronLeft color={c.muted} size={12} /><Text style={{ fontSize: 12, fontWeight: "600", color: c.muted }}> Previous</Text></View>
          </Pressable>
          <Pressable disabled={currentPage >= lastPage} onPress={() => handleSearch(currentPage + 1)} style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: c.border, opacity: currentPage >= lastPage ? 0.3 : 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}><Text style={{ fontSize: 12, fontWeight: "600", color: c.muted }}>Next </Text><ChevronRight color={c.muted} size={12} /></View>
          </Pressable>
        </View>
      )}

      <AnimatePresence>
        {addingPlant && (
          <AddPlantModal plant={addingPlant} API={API} colors={c} onClose={() => setAddingPlant(null)} />
        )}
      </AnimatePresence>
    </ScrollView>
  )
}
