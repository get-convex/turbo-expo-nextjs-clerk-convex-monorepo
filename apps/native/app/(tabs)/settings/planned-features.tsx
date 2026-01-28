import { PlatformColor, ScrollView, Text, View } from "react-native";
import Section from "../../../src/components/section";

const plannedFeatures = [
  "Scheduling protected focus blocks",
  "Custom reminder windows",
  "Exporting reflections and history",
];

export default function PlannedFeaturesScreen() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: PlatformColor("systemGroupedBackground") }}
      contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 28 }}
    >
      <Section title="Planned features">
        <View style={{ padding: 16, gap: 8 }}>
          {plannedFeatures.map((feature) => (
            <Text
              key={feature}
              selectable
              style={{ fontSize: 17, color: PlatformColor("label"), lineHeight: 22 }}
            >
              - {feature}
            </Text>
          ))}
          <Text
            selectable
            style={{ fontSize: 15, color: PlatformColor("secondaryLabel"), lineHeight: 20 }}
          >
            We prioritize additions that reduce friction and keep the daily flow lightweight.
          </Text>
        </View>
      </Section>
    </ScrollView>
  );
}
