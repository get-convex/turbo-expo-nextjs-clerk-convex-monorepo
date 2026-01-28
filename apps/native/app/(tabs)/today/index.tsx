import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "expo-router";
import {
  PlatformColor,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import Section from "../../../src/components/section";
import PrimaryButton from "../../../src/components/primary-button";
import ProgressRow from "../../../src/components/progress-row";
import { getLocalDateKey } from "../../../src/utils/date";

export default function TodayScreen() {
  const router = useRouter();
  const todayKey = useMemo(() => getLocalDateKey(), []);
  const { isAuthenticated } = useConvexAuth();
  const commitmentRecord = useQuery(api.commitments.getForDate, { date: todayKey });
  const momentum = useQuery(api.metrics.getWeeklyMomentum, {});
  const dataSources = useQuery(api.dataSources.listDataSources, {});
  const initializeDataSources = useMutation(api.dataSources.initializeDataSources);
  const upsertCommitment = useMutation(api.commitments.upsertForDate);
  const [commitment, setCommitment] = useState("");
  const hasEditedRef = useRef(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!dataSources || dataSources.length > 0) return;
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;
    void initializeDataSources().catch(() => {
      hasInitializedRef.current = false;
    });
  }, [dataSources, initializeDataSources, isAuthenticated]);

  useEffect(() => {
    if (hasEditedRef.current) return;
    if (!commitmentRecord?.title) return;
    setCommitment(commitmentRecord.title);
  }, [commitmentRecord?.title]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const trimmed = commitment.trim();
    const savedTitle = commitmentRecord?.title ?? "";
    if (trimmed.length === 0 && !commitmentRecord) return;
    if (trimmed === savedTitle) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      void upsertCommitment({
        date: todayKey,
        title: trimmed,
      }).catch(() => {});
    }, 600);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [
    commitment,
    commitmentRecord?.title,
    todayKey,
    upsertCommitment,
    isAuthenticated,
  ]);

  const trimmedCommitment = commitment.trim();
  const helperText =
    trimmedCommitment.length > 0
      ? `Starter: 1 minute on ${trimmedCommitment}.`
      : "Smallest meaningful outcome you can finish today.";

  const completionRate = momentum?.completionRate ?? 0;
  const completedValue = momentum?.completed ?? 0;
  const totalValue = momentum?.total ?? 0;
  const momentumLabel =
    totalValue > 0
      ? `${Math.round(completedValue * 10) / 10}/${totalValue} reflections`
      : "No reflections yet";
  const completionRateLabel = totalValue > 0 ? `${Math.round(completionRate * 100)}%` : "--";

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: PlatformColor("systemGroupedBackground") }}
      contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 28 }}
    >
      <Section title="Today's focus">
        <View style={{ padding: 16, gap: 12 }}>
          <TextInput
            accessibilityLabel="Today's focus"
            placeholder="What will you finish today?"
            placeholderTextColor={PlatformColor("tertiaryLabel")}
            value={commitment}
            onChangeText={(text) => {
              hasEditedRef.current = true;
              setCommitment(text);
            }}
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
            {helperText}
          </Text>
        </View>
      </Section>

      <Section title="Start focus session">
        <View style={{ padding: 16, gap: 12 }}>
          <PrimaryButton
            label="Start focus session"
            onPress={() => router.push("/start-sprint")}
            accessibilityLabel="Start focus session"
            testID="today-start-focus-session"
          />
        </View>
      </Section>

      <Section title="This week" footnote="Small wins build confidence.">
        <ProgressRow
          title="Completion rate"
          value={completionRateLabel}
          progress={completionRate}
          status={momentumLabel}
        />
      </Section>
    </ScrollView>
  );
}
