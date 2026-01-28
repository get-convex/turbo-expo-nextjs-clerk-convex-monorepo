import { useState } from "react";
import { PlatformColor, ScrollView, Switch, Text, View } from "react-native";
import Section from "../../../src/components/section";
import Row from "../../../src/components/row";

export default function SettingsScreen() {
  const [calendarEnabled, setCalendarEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [experimentsEnabled, setExperimentsEnabled] = useState(false);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: PlatformColor("systemGroupedBackground") }}
      contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 28 }}
    >
      <Section title="Data sources">
        <Row
          title="Calendar"
          subtitle="Schedule a protected block for your commitment."
          accessory={
            <Switch
              accessibilityLabel="Calendar"
              value={calendarEnabled}
              onValueChange={setCalendarEnabled}
            />
          }
        />
        <Row
          title="Location"
          subtitle="Tailor prompts to the right place and time."
          accessory={
            <Switch
              accessibilityLabel="Location"
              value={locationEnabled}
              onValueChange={setLocationEnabled}
            />
          }
        />
        <Row
          title="Notifications"
          subtitle="Limited to two nudges per day by default."
          accessory={
            <Switch
              accessibilityLabel="Notifications"
              value={notificationEnabled}
              onValueChange={setNotificationEnabled}
            />
          }
        />
      </Section>

      <Section
        title="Privacy & retention"
        footnote="Raw signals auto-delete after 14 days. Aggregates stay to improve your agency metrics."
      >
        <Row title="Data retention" value="14 days" />
        <Row
          title="Delete data"
          subtitle="Coming soon."
          accessory={
            <Text selectable style={{ fontSize: 13, color: PlatformColor("secondaryLabel") }}>
              Not available
            </Text>
          }
        />
      </Section>

      <Section title="Experiments">
        <Row
          title="Micro-randomization"
          subtitle="Test nudge timing to improve completion rates."
          accessory={
            <Switch
              accessibilityLabel="Micro-randomization"
              value={experimentsEnabled}
              onValueChange={setExperimentsEnabled}
            />
          }
        />
      </Section>

      <Section title="About" footnote="Transparency and prompt versioning will expand in Phase 2.">
        <Row
          title="AI transparency"
          subtitle="Explain how suggestions are generated."
        />
        <Row title="Prompt version" value="v0.1" />
      </Section>
    </ScrollView>
  );
}
