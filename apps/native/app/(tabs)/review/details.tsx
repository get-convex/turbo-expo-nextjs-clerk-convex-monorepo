import { PlatformColor, ScrollView, Text, View } from "react-native";
import { useQuery } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import Section from "../../../src/components/section";

export default function ReviewDetailsScreen() {
  const snapshot = useQuery(api.metrics.getReviewSnapshot, {});

  const blockerCopy = snapshot?.barrierLabel
    ? `Most common blocker: ${snapshot.barrierLabel.toLowerCase()}.`
    : "No dominant blocker yet. Keep logging reflections to surface patterns.";

  const strategyCopy = snapshot?.barrierLabel
    ? `Try a 60-second start to reduce ${snapshot.barrierLabel.toLowerCase()}.`
    : "Try a 60-second start before you begin.";

  const winsCopy = snapshot?.identityEvidence ?? "No wins captured yet.";

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: PlatformColor("systemGroupedBackground") }}
      contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 28 }}
    >
      <Section title="Blocker pattern">
        <View style={{ padding: 16 }}>
          <Text selectable style={{ fontSize: 17, color: PlatformColor("label"), lineHeight: 22 }}>
            {blockerCopy}
          </Text>
        </View>
      </Section>

      <Section title="Try next">
        <View style={{ padding: 16 }}>
          <Text selectable style={{ fontSize: 17, color: PlatformColor("label"), lineHeight: 22 }}>
            {strategyCopy}
          </Text>
        </View>
      </Section>

      <Section title="Wins">
        <View style={{ padding: 16, gap: 8 }}>
          <Text selectable style={{ fontSize: 15, color: PlatformColor("secondaryLabel") }}>
            Wins this week
          </Text>
          <Text selectable style={{ fontSize: 17, color: PlatformColor("label"), lineHeight: 22 }}>
            {winsCopy}
          </Text>
        </View>
      </Section>
    </ScrollView>
  );
}
