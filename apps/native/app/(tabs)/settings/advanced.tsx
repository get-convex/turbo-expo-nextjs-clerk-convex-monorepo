import { useEffect, useMemo, useRef } from "react";
import { PlatformColor, ScrollView, Text, View } from "react-native";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import Section from "../../../src/components/section";
import Row from "../../../src/components/row";
import SegmentedControl from "../../../src/components/segmented-control";
import { DATA_SOURCE_CATALOG } from "../../../src/data/data-sources";

export default function AdvancedSettingsScreen() {
  const dataSources = useQuery(api.dataSources.listDataSources);
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const initializeDataSources = useMutation(api.dataSources.initializeDataSources);
  const updateDataSource = useMutation(api.dataSources.updateDataSource);
  const hasInitializedRef = useRef(false);

  const canMutate = isAuthenticated && !isAuthLoading;

  useEffect(() => {
    if (!canMutate) return;
    if (!dataSources || dataSources.length > 0) return;
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;
    void initializeDataSources().catch(() => {
      hasInitializedRef.current = false;
    });
  }, [dataSources, initializeDataSources, canMutate]);

  const dataSourceMap = useMemo(() => {
    return new Map(dataSources?.map((item) => [item.source, item]) ?? []);
  }, [dataSources]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: PlatformColor("systemGroupedBackground") }}
      contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 28 }}
    >
      <Section
        title="Retention"
        footnote="Retention applies only to enabled connections."
      >
        {DATA_SOURCE_CATALOG.map((definition) => {
          const state = dataSourceMap.get(definition.source);
          const enabled = state?.enabled ?? false;
          const retentionDays = state?.retentionDays ?? definition.retentionOptions[0];
          const options =
            definition.retentionOptions.length > 0
              ? definition.retentionOptions
              : [retentionDays];
          const selectedIndex = Math.max(options.indexOf(retentionDays), 0);
          const retentionDisabled = !canMutate || !enabled;

          return (
            <View key={definition.source} style={{ padding: 16, gap: 8 }}>
              <Text
                selectable
                style={{
                  fontSize: 17,
                  fontWeight: "600",
                  color: PlatformColor("label"),
                }}
              >
                {definition.title}
              </Text>
              <Text selectable style={{ fontSize: 15, color: PlatformColor("secondaryLabel") }}>
                {retentionDays} days
              </Text>
              {options.length > 1 ? (
                <View
                  style={{ opacity: retentionDisabled ? 0.5 : 1 }}
                  pointerEvents={retentionDisabled ? "none" : "auto"}
                >
                  <SegmentedControl
                    values={options.map((option) => `${option}d`)}
                    selectedIndex={selectedIndex}
                    onChange={(index) => {
                      if (retentionDisabled) return;
                      void updateDataSource({
                        source: definition.source,
                        retentionDays: options[index],
                      }).catch(() => {});
                    }}
                  />
                </View>
              ) : null}
            </View>
          );
        })}
      </Section>

      <Section title="Experiments" footnote="Experiments are disabled in this build.">
        <Row title="Micro-randomization" value="Off" />
      </Section>

      <Section title="Prompt version">
        <Row title="Current prompt" value="v0.1" />
      </Section>
    </ScrollView>
  );
}
