import React, { useMemo } from "react"
import { View, Text, Pressable, ScrollView } from "react-native"
import { motion } from "@/lib/motion"
import { useTheme } from "@/components/ThemeProvider"
import { themeColors } from "@/lib/colors"
import { Sprout, Close } from "@/lib/icons"

interface PlantDetailsModalProps {
  plant: any
  onClose: () => void
}

const PlantDetailsModal: React.FC<PlantDetailsModalProps> = ({ plant, onClose }) => {
  const { dark } = useTheme()
  const c = useMemo(() => (dark ? themeColors.dark : themeColors.light), [dark])
  if (!plant) return null

  const renderSection = (title: string, content: any) => {
    if (content === null || content === undefined || (Array.isArray(content) && content.length === 0)) return null
    let displayContent = content
    if (Array.isArray(content)) displayContent = content.join(", ")
    else if (typeof content === "object") displayContent = JSON.stringify(content, null, 2)
    else if (typeof content === "boolean") displayContent = content ? "Yes" : "No"
    return (
      <View style={{ marginBottom: 12 }}>
        <Text style={{ fontSize: 10, fontWeight: "700", letterSpacing: 1, color: c.muted, marginBottom: 4 }}>{title}</Text>
        <Text style={{ fontSize: 13, fontWeight: "500", color: c.text }}>{displayContent}</Text>
      </View>
    )
  }

  return (
    <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 50, justifyContent: "flex-end" }}>
      <Pressable onPress={onClose} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)" }} />
      <motion.View
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        style={{ maxHeight: "90%", backgroundColor: c.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: "hidden" }}
      >
        <ScrollView>
          <View style={{ height: 180, backgroundColor: c.bg, alignItems: "center", justifyContent: "center" }}>
            <Sprout color={c.muted + "40"} size={48} />
          </View>
          <View style={{ padding: 24, gap: 16 }}>
            <Text style={{ fontSize: 22, fontWeight: "700", color: c.text }}>{plant.common_name}</Text>
            {plant.scientific_name && (
              <Text style={{ fontSize: 15, fontStyle: "italic", color: c.muted }}>
                {Array.isArray(plant.scientific_name) ? plant.scientific_name[0] : plant.scientific_name}
              </Text>
            )}

            <View style={{ flexDirection: "row", gap: 24 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: c.accent, borderBottomWidth: 1, borderBottomColor: c.border, paddingBottom: 8, marginBottom: 16 }}>General Info</Text>
                {renderSection("Family", plant.family)}
                {renderSection("Type", plant.type)}
                {renderSection("Cycle", plant.cycle)}
                {renderSection("Origin", plant.origin)}
                {renderSection("Growth Rate", plant.growth_rate)}
                {renderSection("Maintenance", plant.maintenance)}
                {renderSection("Care Level", plant.care_level)}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: c.accent, borderBottomWidth: 1, borderBottomColor: c.border, paddingBottom: 8, marginBottom: 16 }}>Care Details</Text>
                {renderSection("Watering", plant.watering)}
                {renderSection("Sunlight", plant.sunlight)}
                {renderSection("Pruning Month", plant.pruning_month)}
                {renderSection("Soil", plant.soil)}
                {renderSection("Attracts", plant.attracts)}
                {renderSection("Propagation", plant.propagation)}
              </View>
            </View>
          </View>
        </ScrollView>
        <Pressable onPress={onClose} style={{ position: "absolute", top: 12, right: 12, width: 36, height: 36, borderRadius: 18, backgroundColor: c.bg, alignItems: "center", justifyContent: "center" }}>
          <Close color={c.muted} size={16} />
        </Pressable>
      </motion.View>
    </View>
  )
}

export default PlantDetailsModal
