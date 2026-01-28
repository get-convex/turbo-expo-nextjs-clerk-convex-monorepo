import { useMemo } from "react";
import { useRouter } from "expo-router";
import { PlatformColor, ScrollView, Text, View } from "react-native";
import { useQuery } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import Section from "../../../src/components/section";
import Row from "../../../src/components/row";
import PrimaryButton from "../../../src/components/primary-button";

export default function ReviewScreen() {
  const router = useRouter();
  const snapshot = useQuery(api.metrics.getReviewSnapshot, {});
  const momentum = useQuery(api.metrics.getWeeklyMomentum, {});
  const totalReflections = momentum?.total ?? 0;
  const hasEnoughData = totalReflections >= 3;
  const metrics = useMemo(() => {
    const completionRate = snapshot?.completionRate ?? 0;
    const completionLabel = `${Math.round(completionRate * 100)}%`;

    return [
      { label: "Completion rate", value: completionLabel },
      { label: "Reflections logged", value: `${totalReflections}` },
    ];
  }, [snapshot, totalReflections]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: PlatformColor("systemGroupedBackground") }}
      contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 28 }}
    >
      {!hasEnoughData ? (
        <Section
          title="Unlock trends"
          footnote="One tap after a session is enough."
        >
          <View style={{ padding: 16, gap: 12 }}>
            <Text
              selectable
              style={{ fontSize: 17, color: PlatformColor("label"), lineHeight: 22 }}
            >
              Log 3 quick reflections to unlock trends.
            </Text>
            <PrimaryButton
              label="Reflect now"
              onPress={() => router.push("/close-loop")}
              accessibilityLabel="Reflect now"
              testID="review-reflect-now"
            />
          </View>
        </Section>
      ) : (
        <>
          <Section title="This week">
            {metrics.map((metric) => (
              <Row key={metric.label} title={metric.label} value={metric.value} />
            ))}
          </Section>
          <Section title="Details">
            <Row
              title="Patterns and wins"
              subtitle="See blockers and what helped."
              showChevron
              onPress={() => router.push("/review/details")}
            />
          </Section>
        </>
      )}
    </ScrollView>
  );
}
