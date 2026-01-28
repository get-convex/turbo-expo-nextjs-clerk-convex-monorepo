import { useEffect, useMemo, useRef } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { PlatformColor, ScrollView, Switch, Text, View } from "react-native";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import Section from "../../../../src/components/section";
import Row from "../../../../src/components/row";
import { DATA_SOURCE_CATALOG } from "../../../../src/data/data-sources";

export default function ConnectionDetailScreen() {
  const params = useLocalSearchParams<{ source?: string }>();
  const rawSource = Array.isArray(params.source) ? params.source[0] : params.source;
  const definition = DATA_SOURCE_CATALOG.find((item) => item.source === rawSource);

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

  if (!definition) {
    return (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ flex: 1, backgroundColor: PlatformColor("systemGroupedBackground") }}
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 28 }}
      >
        <Section title="Connection">
          <View style={{ padding: 16 }}>
            <Text selectable style={{ fontSize: 17, color: PlatformColor("label") }}>
              Connection not found.
            </Text>
          </View>
        </Section>
      </ScrollView>
    );
  }

  const state = dataSourceMap.get(definition.source);
  const enabled = state?.enabled ?? false;
  const statusLabel = enabled ? "Connected" : "Not connected";

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: PlatformColor("systemGroupedBackground") }}
      contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 28 }}
    >
      <Stack.Screen options={{ title: definition.title }} />

      <Section title="How it helps">
        <View style={{ padding: 16, gap: 8 }}>
          <Text selectable style={{ fontSize: 17, color: PlatformColor("label"), lineHeight: 22 }}>
            {definition.description}
          </Text>
          <Text selectable style={{ fontSize: 15, color: PlatformColor("secondaryLabel") }}>
            {definition.why}
          </Text>
          {definition.requires ? (
            <Text selectable style={{ fontSize: 13, color: PlatformColor("tertiaryLabel") }}>
              {definition.requires}
            </Text>
          ) : null}
        </View>
      </Section>

      <Section
        title="Access"
        footnote="We ask for permission only when you use this connection."
      >
        <Row
          title={statusLabel}
          subtitle={
            canMutate ? "Toggle access at any time." : "Sign in to connect this data."
          }
          accessory={
            <Switch
              accessibilityLabel={`${definition.title} access`}
              value={enabled}
              onValueChange={(next) => {
                if (!canMutate) return;
                void updateDataSource({
                  source: definition.source,
                  enabled: next,
                }).catch(() => {});
              }}
              disabled={!canMutate}
            />
          }
        />
      </Section>
    </ScrollView>
  );
}
