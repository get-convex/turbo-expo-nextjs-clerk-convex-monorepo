import { PlatformColor, ScrollView, Text, View } from "react-native";
import Section from "../../../src/components/section";
import Row from "../../../src/components/row";

const metrics = [
  { label: "Initiative completion", value: "72%" },
  { label: "Perceived control", value: "+8%" },
  { label: "Automaticity trend", value: "Up" },
];

export default function ReviewScreen() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: PlatformColor("systemGroupedBackground") }}
      contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 28 }}
    >
      <Section title="Metrics">
        {metrics.map((metric) => (
          <Row key={metric.label} title={metric.label} value={metric.value} />
        ))}
      </Section>

      <Section title="Barrier pattern">
        <View style={{ padding: 16 }}>
          <Text selectable style={{ fontSize: 17, color: PlatformColor("label"), lineHeight: 22 }}>
            Momentum drops when the first step is vague or the calendar is fragmented.
          </Text>
        </View>
      </Section>

      <Section title="One change for next week">
        <View style={{ padding: 16 }}>
          <Text selectable style={{ fontSize: 17, color: PlatformColor("label"), lineHeight: 22 }}>
            Schedule a protected 25-minute block before noon and pre-write the first action
            the night before.
          </Text>
        </View>
      </Section>

      <Section title="Identity evidence">
        <View style={{ padding: 16, gap: 8 }}>
          <Text selectable style={{ fontSize: 15, color: PlatformColor("secondaryLabel") }}>
            Evidence captured this week
          </Text>
          <Text selectable style={{ fontSize: 17, color: PlatformColor("label"), lineHeight: 22 }}>
            "When I define a clear start, I follow through."
          </Text>
        </View>
      </Section>
    </ScrollView>
  );
}
