import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import {
  PlatformColor,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Section from "../../../src/components/section";
import Row from "../../../src/components/row";
import PrimaryButton from "../../../src/components/primary-button";
import SecondaryButton from "../../../src/components/secondary-button";
import ProgressRow from "../../../src/components/progress-row";

export default function TodayScreen() {
  const router = useRouter();
  const [commitment, setCommitment] = useState("");

  const commitmentSummary = useMemo(() => {
    if (commitment.trim().length > 0) {
      return commitment.trim();
    }
    return "Smallest meaningful outcome you can finish today.";
  }, [commitment]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: PlatformColor("systemGroupedBackground") }}
      contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 28 }}
    >
      <Section title="Commitment">
        <View style={{ padding: 16, gap: 12 }}>
          <TextInput
            accessibilityLabel="Daily commitment"
            placeholder="What will you finish today?"
            placeholderTextColor={PlatformColor("tertiaryLabel")}
            value={commitment}
            onChangeText={setCommitment}
            style={{
              backgroundColor: PlatformColor("systemBackground"),
              borderRadius: 12,
              borderCurve: "continuous",
              borderWidth: 1,
              borderColor: PlatformColor("separator"),
              paddingHorizontal: 12,
              paddingVertical: 10,
              fontSize: 17,
              color: PlatformColor("label"),
              minHeight: 44,
            }}
          />
          <Text
            selectable
            style={{
              fontSize: 15,
              color: PlatformColor("secondaryLabel"),
              lineHeight: 20,
            }}
          >
            Smallest meaningful outcome for who you're becoming.
          </Text>
          <View style={{ gap: 6 }}>
            <Text
              selectable
              style={{ fontSize: 13, color: PlatformColor("secondaryLabel") }}
            >
              Tiny starter
            </Text>
            <Text selectable style={{ color: PlatformColor("label"), fontSize: 15 }}>
              Start with 1 minute.
            </Text>
          </View>
          <View style={{ gap: 6 }}>
            <Text
              selectable
              style={{ fontSize: 13, color: PlatformColor("secondaryLabel") }}
            >
              Current focus
            </Text>
            <Text selectable style={{ fontSize: 17, color: PlatformColor("label") }}>
              {commitmentSummary}
            </Text>
          </View>
        </View>
      </Section>

      <Section title="Momentum">
        <ProgressRow
          title="This week"
          value="3/5 completed"
          progress={0.6}
          status="Not yet today"
        />
      </Section>

      <Section title="If-then plan">
        <Row
          title="Preview"
          subtitle="If [cue], then [starter]. Fallback: [fallback]."
          accessory={
            <Text selectable style={{ fontSize: 13, color: PlatformColor("secondaryLabel") }}>
              Coming soon
            </Text>
          }
        />
      </Section>

      <Section title="Sprint actions">
        <View style={{ padding: 16, gap: 12 }}>
          <PrimaryButton
            label="Start sprint"
            onPress={() => router.push("/start-sprint")}
            accessibilityLabel="Start sprint"
          />
          <SecondaryButton
            label="Schedule a block"
            disabled
            accessibilityLabel="Schedule a focus block"
          />
        </View>
      </Section>

      <Section title="Next support window">
        <Row
          title="11:30 AM"
          subtitle="60-second starter"
          titleStyle={{ fontSize: 19, fontWeight: "600" }}
        />
      </Section>

      <Section title="This week">
        <Row
          title="Review"
          subtitle="Completion rate 72%"
          showChevron
          onPress={() => router.push("/review")}
        />
      </Section>

      <Text
        selectable
        style={{
          fontSize: 13,
          color: PlatformColor("secondaryLabel"),
          lineHeight: 18,
          paddingHorizontal: 4,
        }}
      >
        Tip: Make the first step so small it feels automatic.
      </Text>
    </ScrollView>
  );
}
