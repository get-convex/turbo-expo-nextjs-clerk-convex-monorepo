import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "expo-router";
import { PlatformColor, ScrollView } from "react-native";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import Section from "../../../src/components/section";
import Row from "../../../src/components/row";
import { DATA_SOURCE_CATALOG } from "../../../src/data/data-sources";

export default function SettingsScreen() {
  const router = useRouter();
  const dataSources = useQuery(api.dataSources.listDataSources);
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const initializeDataSources = useMutation(api.dataSources.initializeDataSources);
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
        title="Connections"
        footnote={
          canMutate
            ? "Permissions are requested only when you use a connection."
            : "Sign in to connect your data sources."
        }
      >
        {DATA_SOURCE_CATALOG.map((definition) => {
          const state = dataSourceMap.get(definition.source);
          const enabled = state?.enabled ?? false;
          const statusLabel = !canMutate
            ? "Sign in"
            : enabled
            ? "Connected"
            : "Not connected";

          return (
            <Row
              key={definition.source}
              title={definition.title}
              subtitle={definition.description}
              value={statusLabel}
              showChevron
              onPress={() => router.push(`/settings/connections/${definition.source}`)}
            />
          );
        })}
      </Section>

      <Section title="Advanced">
        <Row
          title="Advanced settings"
          subtitle="Retention, experiments, and prompt version"
          showChevron
          onPress={() => router.push("/settings/advanced")}
        />
      </Section>

      <Section title="About">
        <Row
          title="Planned features"
          subtitle="See what is next on the roadmap."
          showChevron
          onPress={() => router.push("/settings/planned-features")}
        />
        <Row title="AI transparency" subtitle="Explain how suggestions are generated." />
      </Section>
    </ScrollView>
  );
}
