import { useMemo, useState } from "react";
import { Link } from "expo-router";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Button from "../src/components/Button";
import Card from "../src/components/Card";
import ChoicePill from "../src/components/ChoicePill";

const suggestions = [
  "Write the first paragraph",
  "Clarify the next step",
  "Send the one email",
];

export default function TodayScreen() {
  const [commitment, setCommitment] = useState("");
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(
    null
  );

  const commitmentValue = useMemo(() => {
    if (commitment.trim().length > 0) {
      return commitment.trim();
    }
    return selectedSuggestion ?? "Choose a single action you can finish today.";
  }, [commitment, selectedSuggestion]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: "#F5F2EB" }}
      contentContainerStyle={{ padding: 20, gap: 16 }}
    >
      <Card>
        <View style={{ gap: 12 }}>
          <Text selectable style={{ fontSize: 18, fontWeight: "600" }}>
            One commitment, done today
          </Text>
          <Text selectable style={{ color: "#4B5563", lineHeight: 20 }}>
            Keep it outcome-first. The goal is the smallest meaningful result
            that moves you forward.
          </Text>
          <TextInput
            placeholder="What do you want to finish?"
            placeholderTextColor="#9CA3AF"
            value={commitment}
            onChangeText={(value) => {
              setCommitment(value);
              if (value.trim().length > 0) {
                setSelectedSuggestion(null);
              }
            }}
            style={{
              backgroundColor: "#F9FAFB",
              borderRadius: 14,
              borderCurve: "continuous",
              borderWidth: 1,
              borderColor: "#E5E7EB",
              paddingHorizontal: 12,
              paddingVertical: 10,
              fontSize: 16,
            }}
          />
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {suggestions.map((item) => (
              <ChoicePill
                key={item}
                label={item}
                selected={selectedSuggestion === item}
                onPress={() => {
                  setSelectedSuggestion(item);
                  setCommitment("");
                }}
              />
            ))}
          </View>
          <View style={{ gap: 8 }}>
            <Text selectable style={{ color: "#111827", fontWeight: "600" }}>
              Current focus
            </Text>
            <Text selectable style={{ color: "#111827", lineHeight: 22 }}>
              {commitmentValue}
            </Text>
          </View>
          <Link href="/start-sprint" asChild>
            <Button label="Start a 10-minute sprint" />
          </Link>
        </View>
      </Card>

      <Card>
        <View style={{ gap: 12 }}>
          <Text selectable style={{ fontSize: 16, fontWeight: "600" }}>
            Next decision point
          </Text>
          <Text selectable style={{ color: "#4B5563", lineHeight: 20 }}>
            We check in once before lunch to keep momentum without nagging.
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text selectable style={{ color: "#6B7280", fontSize: 12 }}>
                Time window
              </Text>
              <Text
                selectable
                style={{ fontSize: 18, fontWeight: "600", marginTop: 4 }}
              >
                11:30 AM
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text selectable style={{ color: "#6B7280", fontSize: 12 }}>
                Support
              </Text>
              <Text
                selectable
                style={{ fontSize: 18, fontWeight: "600", marginTop: 4 }}
              >
                60-second starter
              </Text>
            </View>
          </View>
        </View>
      </Card>

      <Card>
        <View style={{ gap: 12 }}>
          <Text selectable style={{ fontSize: 16, fontWeight: "600" }}>
            Close the loop when you finish
          </Text>
          <Text selectable style={{ color: "#4B5563", lineHeight: 20 }}>
            Reflection keeps the system outcome-first and builds evidence for
            what works.
          </Text>
          <Link href="/close-loop" asChild>
            <Button label="Log a quick reflection" variant="secondary" />
          </Link>
        </View>
      </Card>

      <View style={{ gap: 12 }}>
        <Link href="/weekly-review">
          <Link.Trigger>
            <Pressable>
              <Card>
                <View style={{ gap: 6 }}>
                  <Text selectable style={{ fontSize: 16, fontWeight: "600" }}>
                    Weekly review
                  </Text>
                  <Text selectable style={{ color: "#4B5563", lineHeight: 20 }}>
                    See outcome trends and refine one constraint for next week.
                  </Text>
                </View>
              </Card>
            </Pressable>
          </Link.Trigger>
          <Link.Preview>
            <View
              style={{
                backgroundColor: "#111827",
                borderRadius: 20,
                borderCurve: "continuous",
                padding: 16,
                gap: 8,
              }}
            >
              <Text selectable style={{ color: "#F9FAFB", fontWeight: "600" }}>
                Preview: weekly review
              </Text>
              <Text selectable style={{ color: "#D1D5DB", lineHeight: 20 }}>
                Outcome rate, barrier patterns, and your next environment tweak.
              </Text>
            </View>
          </Link.Preview>
        </Link>

        <Link href="/settings">
          <Link.Trigger>
            <Pressable>
              <Card>
                <View style={{ gap: 6 }}>
                  <Text selectable style={{ fontSize: 16, fontWeight: "600" }}>
                    Settings
                  </Text>
                  <Text selectable style={{ color: "#4B5563", lineHeight: 20 }}>
                    Manage data sources, privacy, and experiment toggles.
                  </Text>
                </View>
              </Card>
            </Pressable>
          </Link.Trigger>
          <Link.Preview>
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 20,
                borderCurve: "continuous",
                padding: 16,
                borderWidth: 1,
                borderColor: "#E5E7EB",
                gap: 8,
              }}
            >
              <Text selectable style={{ fontWeight: "600" }}>
                Preview: data controls
              </Text>
              <Text selectable style={{ color: "#6B7280", lineHeight: 20 }}>
                Toggle calendar, location, and notification scopes.
              </Text>
            </View>
          </Link.Preview>
        </Link>
      </View>
    </ScrollView>
  );
}
