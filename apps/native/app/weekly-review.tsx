import { ScrollView, Text, View } from "react-native";
import Card from "../src/components/Card";

const metrics = [
  { label: "Initiative completion", value: "72%" },
  { label: "Perceived control", value: "+8%" },
  { label: "Automaticity trend", value: "Up" },
];

export default function WeeklyReviewScreen() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: "#F5F2EB" }}
      contentContainerStyle={{ padding: 20, gap: 16 }}
    >
      <Card>
        <View style={{ gap: 12 }}>
          <Text selectable style={{ fontSize: 16, fontWeight: "600" }}>
            Outcome dashboard
          </Text>
          <View style={{ gap: 10 }}>
            {metrics.map((metric) => (
              <View
                key={metric.label}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#F9FAFB",
                  borderRadius: 14,
                  borderCurve: "continuous",
                  padding: 12,
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                }}
              >
                <Text selectable style={{ color: "#4B5563" }}>
                  {metric.label}
                </Text>
                <Text
                  selectable
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    fontVariant: ["tabular-nums"],
                  }}
                >
                  {metric.value}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Card>

      <Card>
        <View style={{ gap: 10 }}>
          <Text selectable style={{ fontSize: 16, fontWeight: "600" }}>
            Barrier pattern
          </Text>
          <Text selectable style={{ color: "#111827", lineHeight: 22 }}>
            You lose momentum when the first step is vague or when the calendar
            is already fragmented.
          </Text>
        </View>
      </Card>

      <Card>
        <View style={{ gap: 10 }}>
          <Text selectable style={{ fontSize: 16, fontWeight: "600" }}>
            One change for next week
          </Text>
          <Text selectable style={{ color: "#111827", lineHeight: 22 }}>
            Schedule a protected 25-minute block before noon and pre-write the
            first action the night before.
          </Text>
        </View>
      </Card>

      <Card>
        <View style={{ gap: 10 }}>
          <Text selectable style={{ fontSize: 16, fontWeight: "600" }}>
            Evidence for identity
          </Text>
          <Text selectable style={{ color: "#4B5563", lineHeight: 22 }}>
            "When I define a clear start, I follow through." This keeps the
            identity loop grounded in evidence.
          </Text>
        </View>
      </Card>
    </ScrollView>
  );
}
