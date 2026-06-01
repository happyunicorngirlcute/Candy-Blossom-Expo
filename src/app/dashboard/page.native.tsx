import { useEffect, useState, useMemo, useCallback } from "react"
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from "react-native"
import { useRouter } from "expo-router"
import { useTheme } from "@/components/ThemeProvider"
import { themeColors } from "@/lib/colors"

type PlantItem = {
  id: number
  city: string
  nextWateringAt: string | null
  image: string | null
  plant: {
    id: number
    common_name: string
    scientific_name?: string[]
    family?: string
    watering: string | null
    sunlight: string[] | null
  }
}

export default function OverviewPage() {
  const { dark } = useTheme()
  const c = useMemo(() => (dark ? themeColors.dark : themeColors.light), [dark])
  const [userName, setUserName] = useState("")
  const [plants, setPlants] = useState<PlantItem[]>([])
  const [plantCount, setPlantCount] = useState<number | null>(null)
  const [upcomingTasks, setUpcomingTasks] = useState<number | null>(null)
  const [overdueTasks, setOverdueTasks] = useState(0)
  const [hydrationScore, setHydrationScore] = useState(100)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const API = process.env.EXPO_PUBLIC_API_URL

  const loadData = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true)
    setError(null)
    try {
      const [plantsRes, meRes] = await Promise.all([
        fetch(`${API}/user/plants`),
        fetch(`${API}/user/me`).catch(() => null),
      ])
      if (meRes?.ok) {
        const meData = await meRes.json()
        if (meData?.name) setUserName(meData.name)
      }
      const data = await plantsRes.json()
      if (!plantsRes.ok) {
        setError(data.error || "Unable to load your plants.")
        return
      }
      const plantList: PlantItem[] = data.data || []
      setPlants(plantList)
      setPlantCount(plantList.length)

      const now = new Date()
      now.setHours(0, 0, 0, 0)
      let upcoming = 0, overdue = 0
      plantList.forEach((item) => {
        if (!item.nextWateringAt) return
        const d = new Date(item.nextWateringAt)
        d.setHours(0, 0, 0, 0)
        const diff = Math.ceil((d.getTime() - now.getTime()) / 86400000)
        if (diff < 0) overdue++
        else if (diff <= 7) upcoming++
      })
      setUpcomingTasks(upcoming)
      setOverdueTasks(overdue)
      setHydrationScore(plantList.length > 0 ? Math.round(((plantList.length - overdue) / plantList.length) * 100) : 100)
    } catch {
      setError("An error occurred while loading your dashboard.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [API])

  useEffect(() => { loadData() }, [loadData])

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Not scheduled"
    const now = new Date(); now.setHours(0, 0, 0, 0)
    const d = new Date(dateStr); d.setHours(0, 0, 0, 0)
    const diff = Math.ceil((d.getTime() - now.getTime()) / 86400000)
    if (diff === 0) return "Today"
    if (diff === 1) return "Tomorrow"
    if (diff === -1) return "Overdue (Yesterday)"
    if (diff < -1) return `Overdue (${Math.abs(diff)} days ago)`
    return `In ${diff} days`
  }

  const isOverdue = (dateStr: string | null) => {
    if (!dateStr) return false
    const now = new Date(); now.setHours(0, 0, 0, 0)
    const d = new Date(dateStr); d.setHours(0, 0, 0, 0)
    return d.getTime() < now.getTime()
  }

  const MetricCard = ({ label, value, suffix, accent, valueColor }: { label: string; value: string | number; suffix?: string; accent: string; valueColor?: string }) => (
    <View style={{ flex: 1, minWidth: "30%", padding: 16, borderRadius: 16, borderWidth: 1, borderColor: c.muted + "40", backgroundColor: c.surface, overflow: "hidden" }}>
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, backgroundColor: accent + "99" }} />
      <Text style={{ fontSize: 10, fontWeight: "700", letterSpacing: 1, color: c.muted }}>{label.toUpperCase()}</Text>
      <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6, marginTop: 8 }}>
        <Text style={{ fontSize: 28, fontWeight: "600", color: valueColor || c.text }}>{value}</Text>
        {suffix && <Text style={{ fontSize: 11, color: c.muted }}>{suffix}</Text>}
      </View>
    </View>
  )

  if (loading) return (
    <View style={{ flex: 1, backgroundColor: c.bg, alignItems: "center", justifyContent: "center", gap: 8 }}>
      <ActivityIndicator size="small" color={c.accent} />
      <Text style={{ fontSize: 12, color: c.muted + "80" }}>Analyzing your garden...</Text>
    </View>
  )

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: c.bg }}
      contentContainerStyle={{ padding: 24, gap: 20 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(true) }} tintColor={c.accent} />}
    >
      <Text style={{ fontSize: 20, fontWeight: "600", color: c.text }}>{userName || "there"} emerges.</Text>

      {error && (
        <View style={{ padding: 12, borderRadius: 12, backgroundColor: "#ef444410", borderWidth: 1, borderColor: "#ef444420" }}>
          <Text style={{ color: "#ef4444", fontSize: 13 }}>{error}</Text>
        </View>
      )}

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        <MetricCard label="Plants in Collection" value={plantCount ?? 0} suffix="species" accent={c.accent} />
        <MetricCard label="Care Needed" value={upcomingTasks ?? 0} accent="#3b82f6"
          valueColor={overdueTasks > 0 ? "#ef4444" : undefined}
          suffix={overdueTasks > 0 ? `${overdueTasks} overdue!` : "due next 7 days"} />
        <MetricCard label="Garden Hydration Score" value={`${hydrationScore}%`} accent="#22c55e" valueColor="#22c55e"
          suffix={hydrationScore > 85 ? "Optimal hydration" : "Needs attention"} />
      </View>

      <View style={{ borderRadius: 16, borderWidth: 1, borderColor: c.muted + "40", backgroundColor: c.surface, padding: 20, gap: 16 }}>
        <Text style={{ fontSize: 13, fontWeight: "700", color: c.muted }}>Plants that need hydration the most</Text>
        {plants.length === 0 ? (
          <Text style={{ fontSize: 12, color: c.muted + "80" }}>No active plants</Text>
        ) : (
          <View style={{ gap: 8 }}>
            {plants.map((item) => {
              const p = item.plant
              const overdue = isOverdue(item.nextWateringAt)
              return (
                <View key={item.id} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 12, borderRadius: 12, borderWidth: 1, borderColor: c.border, backgroundColor: c.bg }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
                    <Text style={{ fontSize: 20 }}>🪴</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 12, fontWeight: "700", color: c.text }} numberOfLines={1}>{p.common_name}</Text>
                      <Text style={{ fontSize: 10, color: c.muted + "99" }} numberOfLines={1}>{p.scientific_name?.[0] || p.family || "Indoor species"}</Text>
                    </View>
                  </View>
                  <Text style={{ fontSize: 11, fontWeight: "600", color: overdue ? "#ef4444" : c.text }}>{formatDate(item.nextWateringAt)}</Text>
                </View>
              )
            })}
          </View>
        )}
      </View>
    </ScrollView>
  )
}
