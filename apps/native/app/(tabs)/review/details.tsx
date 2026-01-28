import { PlatformColor, ScrollView, Text, View } from "react-native";
import { useQuery } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import Section from "../../../src/components/section";

export default function ReviewDetailsScreen() {
  const snapshot = useQuery(api.metrics.getReviewSnapshot, {});

  const barrierCopy = snapshot?.barrierLabel
    ? `Most common blocker: ${snapshot.barrierLabel.toLowerCase()}.`
    : "No dominant blocker yet. Keep logging reflections to surface patterns.";

  const strategyCopy = snapshot?.barrierLabel
    ? `Reduce ${snapshot.barrierLabel.toLowerCase()} by pre-deciding your first 60 seconds.`
    : "Try pre-deciding your first 60 seconds before you start.";

  const identityEvidence =
    snapshot?.identityEvidence ?? "No identity evidence captured yet.";

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: PlatformColor("systemGroupedBackground") }}
      contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 28 }}
    >
      <Section title="Barrier pattern">
        <View style={{ padding: 16 }}>
          <Text selectable style={{ fontSize: 17, color: PlatformColor("label"), lineHeight: 22 }}>
            {barrierCopy}
          </Text>
        </View>
      </Section>

      <Section title="Next step">
        <View style={{ padding: 16 }}>
          <Text selectable style={{ fontSize: 17, color: PlatformColor("label"), lineHeight: 22 }}>
            {strategyCopy}
          </Text>
        </View>
      </Section>

      <Section title="Identity evidence">
        <View style={{ padding: 16, gap: 8 }}>
          <Text selectable style={{ fontSize: 15, color: PlatformColor("secondaryLabel") }}>
            Evidence captured this week
          </Text>
          <Text selectable style={{ fontSize: 17, color: PlatformColor("label"), lineHeight: 22 }}>
            {identityEvidence}
          </Text>
        </View>
      </Section>
    </ScrollView>
  );
}
