import { useMemo, useRef, useState } from "react";
import { useRouter } from "expo-router";
import {
  Animated,
  PlatformColor,
  Pressable,
  ScrollView,
  Text,
  Vibration,
  View,
} from "react-native";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import type { Id } from "@packages/backend/convex/_generated/dataModel";
import Section from "../../src/components/section";
import Row from "../../src/components/row";
import PrimaryButton from "../../src/components/primary-button";
import SecondaryButton from "../../src/components/secondary-button";
import SegmentedControl from "../../src/components/segmented-control";
import { getLocalDateKey } from "../../src/utils/date";

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
  const todayKey = useMemo(() => getLocalDateKey(), []);
  const commitmentRecord = useQuery(api.commitments.getForDate, { date: todayKey });
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const startSprint = useMutation(api.sprints.startSprint);
  const endSprint = useMutation(api.sprints.endSprint);
  const [isRunning, setIsRunning] = useState(false);
  const [durationIndex, setDurationIndex] = useState(0);
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [showRescopes, setShowRescopes] = useState(false);
  const [selectedRescope, setSelectedRescope] = useState<string | null>(null);
  const [activeSprintId, setActiveSprintId] = useState<Id<"sprints"> | null>(null);
  const checkScale = useRef(new Animated.Value(0)).current;
  const [showCheck, setShowCheck] = useState(false);

  const durationLabel = useMemo(() => {
    return ["10 min", "20 min", "30 min"][durationIndex] ?? "10 min";
  }, [durationIndex]);
  const durationMinutes = useMemo(() => {
    return [10, 20, 30][durationIndex] ?? 10;
  }, [durationIndex]);

  const sprintFocus = commitmentRecord?.title ?? "Write the first paragraph of the proposal.";
  const canStartSprint = isAuthenticated && !isAuthLoading;

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

  const handleToggleHelp = () => {
    setShowHelp((prev) => {
      const next = !prev;
      if (!next) {
        setShowSteps(false);
        setShowRescopes(false);
      }
      return next;
    });
  };

  const handleToggleSprint = () => {
    if (!canStartSprint) {
      return;
    }
    triggerHaptic();
    if (!isRunning) {
      triggerStartFeedback();
      void startSprint({
        commitmentId: commitmentRecord?._id,
        durationMinutes: durationMinutes,
        steps: steps.map((step) => ({
          id: step.id,
          instruction: step.label,
          durationMinutes: step.minutes,
        })),
      })
        .then((id) => {
          setActiveSprintId(id);
        })
        .catch(() => {});
    } else if (activeSprintId) {
      void endSprint({ sprintId: activeSprintId, outcome: "paused" }).catch(() => {});
      setActiveSprintId(null);
    }

    setIsRunning((prev) => !prev);
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: PlatformColor("systemGroupedBackground") }}
      contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 28 }}
    >
      <Section title="Your focus">
        <View style={{ padding: 16, gap: 8 }}>
          <Text selectable style={{ fontSize: 17, color: PlatformColor("label") }}>
            {sprintFocus}
          </Text>
          <Text
            selectable
            style={{ fontSize: 15, color: PlatformColor("secondaryLabel"), lineHeight: 20 }}
          >
            Default {durationLabel}. Adjust if you need more time.
          </Text>
        </View>
        <Row
          title="Duration"
          value={durationLabel}
          onPress={() => setShowDurationPicker((prev) => !prev)}
          accessory={
            <Text selectable style={{ fontSize: 15, color: PlatformColor("systemBlue") }}>
              {showDurationPicker ? "Hide" : "Change"}
            </Text>
          }
        />
      </Section>

      {showDurationPicker ? (
        <Section
          title="Duration"
          footnote="Pick a short window you can protect right now."
        >
          <View style={{ padding: 16 }}>
            <SegmentedControl
              values={["10 min", "20 min", "30 min"]}
              selectedIndex={durationIndex}
              onChange={setDurationIndex}
            />
          </View>
        </Section>
      ) : null}

      <View style={{ gap: 12 }}>
        <PrimaryButton
          label={
            canStartSprint
              ? isRunning
                ? "Pause session"
                : "Start focus session"
              : "Sign in to start session"
          }
          onPress={handleToggleSprint}
          disabled={!canStartSprint}
          testID="focus-session-toggle"
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
        {isRunning ? (
          <SecondaryButton
            label="End & reflect"
            onPress={() => {
              triggerHaptic();
              if (activeSprintId) {
                void endSprint({ sprintId: activeSprintId, outcome: "completed" }).catch(
                  () => {}
                );
                setActiveSprintId(null);
              }
              router.push("/close-loop");
            }}
            testID="focus-session-end-reflect"
          />
        ) : null}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={showHelp ? "Hide help options" : "Need help"}
        onPress={handleToggleHelp}
        testID="focus-session-need-help"
        style={({ pressed }) => [
          {
            alignSelf: "flex-start",
            paddingHorizontal: 12,
            paddingVertical: 10,
            minHeight: 44,
            borderRadius: 10,
          },
          pressed && { backgroundColor: PlatformColor("tertiarySystemFill") },
        ]}
      >
        <Text
          selectable
          style={{ fontSize: 15, fontWeight: "600", color: PlatformColor("systemBlue") }}
        >
          {showHelp ? "Hide help options" : "Need help?"}
        </Text>
      </Pressable>

      {showHelp ? (
        <>
          <Section title="Need help?">
            <Row
              title="Micro-steps"
              subtitle="Break it into three quick steps."
              onPress={() => setShowSteps((prev) => !prev)}
              accessory={
                <Text selectable style={{ fontSize: 15, color: PlatformColor("systemBlue") }}>
                  {showSteps ? "Hide" : "Show"}
                </Text>
              }
            />
            <Row
              title="Rescope"
              subtitle="Make it smaller for today."
              onPress={() => setShowRescopes((prev) => !prev)}
              accessory={
                <Text selectable style={{ fontSize: 15, color: PlatformColor("systemBlue") }}>
                  {showRescopes ? "Hide" : "Show"}
                </Text>
              }
            />
          </Section>

          {showSteps ? (
            <Section title="Micro-steps">
              {steps.map((step) => (
                <Row
                  key={step.id}
                  title={step.label}
                  subtitle={`Step ${step.id} - ${step.minutes} min`}
                />
              ))}
            </Section>
          ) : null}

          {showRescopes ? (
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
          ) : null}
        </>
      ) : null}
    </ScrollView>
  );
}
