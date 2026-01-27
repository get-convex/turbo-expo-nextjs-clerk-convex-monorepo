import { useState } from "react";
import { Link } from "expo-router";
import { ScrollView, Text, TextInput, View } from "react-native";
import Button from "../src/components/Button";
import Card from "../src/components/Card";
import ChoicePill from "../src/components/ChoicePill";

const outcomes = ["Yes", "Partial", "Not yet"];
const blockers = ["Energy", "Ambiguity", "Interruptions", "Tools", "Time"];

export default function CloseLoopScreen() {
  const [outcome, setOutcome] = useState<string | null>(null);
  const [selectedBlockers, setSelectedBlockers] = useState<string[]>([]);
  const [whatWorked, setWhatWorked] = useState("");
  const [whatBlocked, setWhatBlocked] = useState("");

  const toggleBlocker = (label: string) => {
    setSelectedBlockers((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label]
    );
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: "#F5F2EB" }}
      contentContainerStyle={{ padding: 20, gap: 16 }}
    >
      <Card>
        <View style={{ gap: 12 }}>
          <Text selectable style={{ fontSize: 16, fontWeight: "600" }}>
            Did you complete the commitment?
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {outcomes.map((label) => (
              <ChoicePill
                key={label}
                label={label}
                selected={outcome === label}
                onPress={() => setOutcome(label)}
              />
            ))}
          </View>
        </View>
      </Card>

      <Card>
        <View style={{ gap: 12 }}>
          <Text selectable style={{ fontSize: 16, fontWeight: "600" }}>
            What blocked you?
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {blockers.map((label) => (
              <ChoicePill
                key={label}
                label={label}
                selected={selectedBlockers.includes(label)}
                onPress={() => toggleBlocker(label)}
              />
            ))}
          </View>
          <TextInput
            placeholder="Add context"
            placeholderTextColor="#9CA3AF"
            value={whatBlocked}
            onChangeText={setWhatBlocked}
            multiline
            style={{
              minHeight: 80,
              backgroundColor: "#F9FAFB",
              borderRadius: 14,
              borderCurve: "continuous",
              borderWidth: 1,
              borderColor: "#E5E7EB",
              paddingHorizontal: 12,
              paddingVertical: 10,
              fontSize: 15,
              lineHeight: 20,
            }}
          />
        </View>
      </Card>

      <Card>
        <View style={{ gap: 12 }}>
          <Text selectable style={{ fontSize: 16, fontWeight: "600" }}>
            What helped or worked?
          </Text>
          <TextInput
            placeholder="Capture the one thing that helped"
            placeholderTextColor="#9CA3AF"
            value={whatWorked}
            onChangeText={setWhatWorked}
            multiline
            style={{
              minHeight: 80,
              backgroundColor: "#F9FAFB",
              borderRadius: 14,
              borderCurve: "continuous",
              borderWidth: 1,
              borderColor: "#E5E7EB",
              paddingHorizontal: 12,
              paddingVertical: 10,
              fontSize: 15,
              lineHeight: 20,
            }}
          />
          <Text selectable style={{ color: "#6B7280", lineHeight: 20 }}>
            Next day adjustment (draft): time-box the first 10 minutes before
            checking messages.
          </Text>
        </View>
      </Card>

      <View style={{ gap: 12 }}>
        <Button label="Save reflection" />
        <Link href="/weekly-review" asChild>
          <Button label="See weekly review" variant="secondary" />
        </Link>
      </View>
    </ScrollView>
  );
}
