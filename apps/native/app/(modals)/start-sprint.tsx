import { useMemo, useRef, useState } from "react";
import { useRouter } from "expo-router";
import {
  Animated,
  PlatformColor,
  ScrollView,
  Text,
  Vibration,
  View,
} from "react-native";
import Section from "../../src/components/section";
import Row from "../../src/components/row";
import PrimaryButton from "../../src/components/primary-button";
import SecondaryButton from "../../src/components/secondary-button";
import SegmentedControl from "../../src/components/segmented-control";

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
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);
  const [durationIndex, setDurationIndex] = useState(0);
  const [selectedRescope, setSelectedRescope] = useState<string | null>(null);
  const checkScale = useRef(new Animated.Value(0)).current;
  const [showCheck, setShowCheck] = useState(false);

  const durationLabel = useMemo(() => {
    return ["10 min", "20 min", "30 min"][durationIndex] ?? "10 min";
  }, [durationIndex]);

  const triggerHaptic = () => {
    if (process.env.EXPO_OS === "ios") {
      Vibration.vibrate(10);
    }
  };

  const triggerStartFeedback = () => {
    setShowCheck(true);
    checkScale.setValue(0);
    Animated.sequence([
      Animated.spring(checkScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 16,
        bounciness: 6,
      }),
      Animated.delay(400),
      Animated.timing(checkScale, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setShowCheck(false));
  };

  const handleToggleSprint = () => {
    triggerHaptic();
    setIsRunning((prev) => {
      const next = !prev;
      if (!prev && next) {
        triggerStartFeedback();
      }
      return next;
    });
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: PlatformColor("systemGroupedBackground") }}
      contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 28 }}
    >
      <Section title="Sprint focus">
        <View style={{ padding: 16, gap: 8 }}>
          <Text selectable style={{ fontSize: 17, color: PlatformColor("label") }}>
            Write the first paragraph of the proposal.
          </Text>
          <Text
            selectable
            style={{ fontSize: 15, color: PlatformColor("secondaryLabel"), lineHeight: 20 }}
          >
            Target: {durationLabel}. Start small and rescope without penalty.
          </Text>
        </View>
      </Section>

      <Section title="Sprint duration" footnote="Pick a short window you can protect right now.">
        <View style={{ padding: 16 }}>
          <SegmentedControl
            values={["10 min", "20 min", "30 min"]}
            selectedIndex={durationIndex}
            onChange={setDurationIndex}
          />
        </View>
      </Section>

      <Section title="Micro-steps">
        {steps.map((step) => (
          <Row
            key={step.id}
            title={step.label}
            subtitle={`Step ${step.id} - ${step.minutes} min`}
          />
        ))}
      </Section>

      <Section
        title="Rescope options"
        footnote="Choose a smaller win if momentum stalls."
      >
        {rescopes.map((option) => (
          <Row
            key={option}
            title={option}
            onPress={() => {
              triggerHaptic();
              setSelectedRescope(option);
            }}
            accessory={
              selectedRescope === option ? (
                <Text selectable style={{ fontSize: 16, color: PlatformColor("label") }}>
                  {"\u2713"}
                </Text>
              ) : null
            }
          />
        ))}
      </Section>

      <View style={{ gap: 12 }}>
        <PrimaryButton
          label={isRunning ? "Pause sprint" : "Start sprint"}
          onPress={handleToggleSprint}
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
        <SecondaryButton
          label="Finish & reflect"
          onPress={() => {
            triggerHaptic();
            router.push("/close-loop");
          }}
        />
      </View>
    </ScrollView>
  );
}
