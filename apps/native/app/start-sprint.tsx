import { useState } from "react";
import { Link } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import Button from "../src/components/Button";
import Card from "../src/components/Card";

const steps = [
  { id: "1", label: "Open the doc and name the file", minutes: 2 },
  { id: "2", label: "Draft the first usable paragraph", minutes: 6 },
  { id: "3", label: "Add a closing line + next step", minutes: 2 },
];

const rescopes = [
  "Just outline the first sentence",
  "Write the heading only",
  "Capture the blocker in one line",
];

export default function StartSprintScreen() {
  const [isRunning, setIsRunning] = useState(false);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: "#F5F2EB" }}
      contentContainerStyle={{ padding: 20, gap: 16 }}
    >
      <Card>
        <View style={{ gap: 10 }}>
          <Text selectable style={{ fontSize: 16, fontWeight: "600" }}>
            Sprint focus
          </Text>
          <Text selectable style={{ color: "#111827", fontSize: 18 }}>
            Write the first paragraph of the proposal.
          </Text>
          <Text selectable style={{ color: "#6B7280", lineHeight: 20 }}>
            Target: 10 minutes. We only care about a completed outcome.
          </Text>
        </View>
      </Card>

      <Card>
        <View style={{ gap: 12 }}>
          <Text selectable style={{ fontSize: 16, fontWeight: "600" }}>
            Micro-steps
          </Text>
          {steps.map((step) => (
            <View
              key={step.id}
              style={{
                padding: 12,
                borderRadius: 14,
                borderCurve: "continuous",
                backgroundColor: "#F9FAFB",
                borderWidth: 1,
                borderColor: "#E5E7EB",
                gap: 4,
              }}
            >
              <Text selectable style={{ fontWeight: "600" }}>
                Step {step.id}
              </Text>
              <Text selectable style={{ color: "#111827", lineHeight: 20 }}>
                {step.label}
              </Text>
              <Text selectable style={{ color: "#6B7280" }}>
                {step.minutes} minutes
              </Text>
            </View>
          ))}
        </View>
      </Card>

      <Card>
        <View style={{ gap: 10 }}>
          <Text selectable style={{ fontSize: 16, fontWeight: "600" }}>
            60-second starter
          </Text>
          <Text selectable style={{ color: "#4B5563", lineHeight: 20 }}>
            Open the doc, write a rough headline, and start with one honest
            sentence. Momentum is the goal.
          </Text>
        </View>
      </Card>

      <Card>
        <View style={{ gap: 12 }}>
          <Text selectable style={{ fontSize: 16, fontWeight: "600" }}>
            If you stall, rescope to
          </Text>
          {rescopes.map((option) => (
            <View
              key={option}
              style={{
                padding: 12,
                borderRadius: 14,
                borderCurve: "continuous",
                backgroundColor: "#FFFFFF",
                borderWidth: 1,
                borderColor: "#E5E7EB",
              }}
            >
              <Text selectable style={{ color: "#111827" }}>
                {option}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      <View style={{ gap: 12 }}>
        <Button
          label={isRunning ? "Sprint running" : "Start the 10-minute sprint"}
          onPress={() => setIsRunning((prev) => !prev)}
        />
        <Link href="/close-loop" asChild>
          <Button label="Finish and reflect" variant="secondary" />
        </Link>
      </View>
    </ScrollView>
  );
}
