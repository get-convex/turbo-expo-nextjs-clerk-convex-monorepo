import { useMemo, useRef, useState } from "react";
import {
  Animated,
  PlatformColor,
  ScrollView,
  Text,
  TextInput,
  Vibration,
  View,
} from "react-native";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import Section from "../../src/components/section";
import Row from "../../src/components/row";
import PrimaryButton from "../../src/components/primary-button";
import SegmentedControl from "../../src/components/segmented-control";
import { getLocalDateKey } from "../../src/utils/date";

const outcomes = [
  { label: "Yes", value: "yes" },
  { label: "Partial", value: "partial" },
  { label: "Not yet", value: "not_yet" },
];
const blockers = ["Energy", "Ambiguity", "Interruptions", "Tools", "Time"];

export default function CloseLoopScreen() {
  const todayKey = useMemo(() => getLocalDateKey(), []);
  const commitmentRecord = useQuery(api.commitments.getForDate, { date: todayKey });
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const logEvidence = useMutation(api.evidenceLogs.logEvidence);
  const [outcomeIndex, setOutcomeIndex] = useState(0);
  const [selectedBlockers, setSelectedBlockers] = useState<string[]>([]);
  const [whatHelped, setWhatHelped] = useState("");
  const [showCheck, setShowCheck] = useState(false);
  const [showPostSaveTip, setShowPostSaveTip] = useState(false);
  const checkScale = useRef(new Animated.Value(0)).current;

  const triggerHaptic = () => {
    if (process.env.EXPO_OS === "ios") {
      Vibration.vibrate(10);
    }
  };

  const triggerSaveFeedback = () => {
    setShowCheck(true);
    checkScale.setValue(0);
    Animated.sequence([
      Animated.spring(checkScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 16,
        bounciness: 6,
      }),
      Animated.delay(500),
      Animated.timing(checkScale, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setShowCheck(false));
  };

  const toggleBlocker = (label: string) => {
    triggerHaptic();
    setShowPostSaveTip(false);
    setSelectedBlockers((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label]
    );
  };

  const outcomeValue = outcomes[outcomeIndex]?.value ?? "yes";
  const canSaveReflection = isAuthenticated && !isAuthLoading;
  const showBlockers = outcomeValue !== "yes";
  const showNotes = showBlockers && selectedBlockers.length > 0;
  const blockerTags = showBlockers ? selectedBlockers : [];
  const learnings = showNotes && whatHelped.trim().length > 0 ? whatHelped.trim() : undefined;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: PlatformColor("systemGroupedBackground") }}
      contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 28 }}
    >
      <Section title="Outcome">
        <View style={{ padding: 16, gap: 12 }}>
          <Text selectable style={{ fontSize: 15, color: PlatformColor("secondaryLabel") }}>
            Did you complete today's focus?
          </Text>
          <SegmentedControl
            values={outcomes.map((outcome) => outcome.label)}
            selectedIndex={outcomeIndex}
            onChange={(index) => {
              triggerHaptic();
              setShowPostSaveTip(false);
              const nextOutcome = outcomes[index]?.value ?? "yes";
              if (nextOutcome === "yes") {
                setSelectedBlockers([]);
                setWhatHelped("");
              }
              setOutcomeIndex(index);
            }}
          />
        </View>
      </Section>

      {showBlockers ? (
        <Section title="Blockers" footnote="Pick anything that got in the way.">
          {blockers.map((label) => (
            <Row
              key={label}
              title={label}
              onPress={() => toggleBlocker(label)}
              accessory={
                selectedBlockers.includes(label) ? (
                  <Text selectable style={{ fontSize: 16, color: PlatformColor("label") }}>
                    {"\u2713"}
                  </Text>
                ) : null
              }
            />
          ))}
        </Section>
      ) : null}

      {showNotes ? (
        <Section title="Optional note">
          <View style={{ padding: 16, gap: 12 }}>
            <TextInput
              accessibilityLabel="Optional note"
              placeholder="What got in the way?"
              placeholderTextColor={PlatformColor("tertiaryLabel")}
              value={whatHelped}
              onChangeText={(text) => {
                setShowPostSaveTip(false);
                setWhatHelped(text);
              }}
              multiline
              textAlignVertical="top"
              style={{
                minHeight: 88,
                backgroundColor: PlatformColor("systemBackground"),
                borderRadius: 12,
                borderCurve: "continuous",
                borderWidth: 1,
                borderColor: PlatformColor("separator"),
                paddingHorizontal: 12,
                paddingVertical: 10,
                fontSize: 16,
                color: PlatformColor("label"),
                lineHeight: 20,
              }}
            />
          </View>
        </Section>
      ) : null}

      <View style={{ gap: 12 }}>
        <PrimaryButton
          label={canSaveReflection ? "Save" : "Sign in to save"}
          onPress={() => {
            if (!canSaveReflection) return;
            triggerHaptic();
            triggerSaveFeedback();
            void logEvidence({
              commitmentId: commitmentRecord?._id,
              outcomeLabel: outcomeValue,
              blockerTags,
              learnings,
            }).catch(() => {});
            setShowPostSaveTip(true);
          }}
          disabled={!canSaveReflection}
          testID="reflect-save"
          accessory={
            showCheck ? (
              <Animated.Text
                selectable
                style={{
                  color: PlatformColor("systemBackground"),
                  fontSize: 18,
                  fontWeight: "600",
                  transform: [{ scale: checkScale }],
                  opacity: checkScale,
                }}
              >
                {"\u2713"}
              </Animated.Text>
            ) : null
          }
        />
        {showPostSaveTip ? (
          <Text
            selectable
            style={{ fontSize: 13, color: PlatformColor("secondaryLabel"), lineHeight: 18 }}
          >
            Saved. Nice job showing up today.
          </Text>
        ) : null}
      </View>
    </ScrollView>
  );
}
