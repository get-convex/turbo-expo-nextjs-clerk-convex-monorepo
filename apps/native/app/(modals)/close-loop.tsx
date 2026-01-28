import { useRef, useState } from "react";
import { useRouter } from "expo-router";
import {
  Animated,
  PlatformColor,
  ScrollView,
  Text,
  TextInput,
  Vibration,
  View,
} from "react-native";
import Section from "../../src/components/section";
import Row from "../../src/components/row";
import PrimaryButton from "../../src/components/primary-button";
import SecondaryButton from "../../src/components/secondary-button";
import SegmentedControl from "../../src/components/segmented-control";

const outcomes = ["Yes", "Partial", "Not yet"];
const blockers = ["Energy", "Ambiguity", "Interruptions", "Tools", "Time"];

export default function CloseLoopScreen() {
  const router = useRouter();
  const [outcomeIndex, setOutcomeIndex] = useState(0);
  const [selectedBlockers, setSelectedBlockers] = useState<string[]>([]);
  const [whatHelped, setWhatHelped] = useState("");
  const [showCheck, setShowCheck] = useState(false);
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
    setSelectedBlockers((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label]
    );
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: PlatformColor("systemGroupedBackground") }}
      contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 28 }}
    >
      <Section title="Outcome">
        <View style={{ padding: 16, gap: 12 }}>
          <Text selectable style={{ fontSize: 15, color: PlatformColor("secondaryLabel") }}>
            Did you complete the commitment?
          </Text>
          <SegmentedControl
            values={outcomes}
            selectedIndex={outcomeIndex}
            onChange={(index) => {
              triggerHaptic();
              setOutcomeIndex(index);
            }}
          />
        </View>
      </Section>

      <Section title="Blockers">
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

      <Section title="What helped most?">
        <View style={{ padding: 16, gap: 12 }}>
          <TextInput
            accessibilityLabel="What helped most"
            placeholder="Optional"
            placeholderTextColor={PlatformColor("tertiaryLabel")}
            value={whatHelped}
            onChangeText={setWhatHelped}
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
          <Text selectable style={{ fontSize: 13, color: PlatformColor("secondaryLabel") }}>
            Next day adjustment: time-box the first 10 minutes before checking messages.
          </Text>
        </View>
      </Section>

      <View style={{ gap: 12 }}>
        <PrimaryButton
          label="Save reflection"
          onPress={() => {
            triggerHaptic();
            triggerSaveFeedback();
          }}
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
          label="See weekly review"
          onPress={() => {
            triggerHaptic();
            router.push("/review");
          }}
        />
      </View>
    </ScrollView>
  );
}
