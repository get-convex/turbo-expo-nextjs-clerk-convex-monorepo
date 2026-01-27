import { useState } from "react";
import { ScrollView, Switch, Text, View } from "react-native";
import Card from "../src/components/Card";

export default function SettingsScreen() {
  const [calendarEnabled, setCalendarEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [experimentsEnabled, setExperimentsEnabled] = useState(false);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: "#F5F2EB" }}
      contentContainerStyle={{ padding: 20, gap: 16 }}
    >
      <Card>
        <View style={{ gap: 12 }}>
          <Text selectable style={{ fontSize: 16, fontWeight: "600" }}>
            Data sources
          </Text>
          <View style={{ gap: 12 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flex: 1, paddingRight: 12, gap: 4 }}>
                <Text selectable style={{ fontWeight: "600" }}>
                  Calendar
                </Text>
                <Text selectable style={{ color: "#6B7280", lineHeight: 20 }}>
                  Used to schedule a protected block for your commitment.
                </Text>
              </View>
              <Switch
                value={calendarEnabled}
                onValueChange={setCalendarEnabled}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flex: 1, paddingRight: 12, gap: 4 }}>
                <Text selectable style={{ fontWeight: "600" }}>
                  Location
                </Text>
                <Text selectable style={{ color: "#6B7280", lineHeight: 20 }}>
                  Helps tailor prompts to the right place and time.
                </Text>
              </View>
              <Switch
                value={locationEnabled}
                onValueChange={setLocationEnabled}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flex: 1, paddingRight: 12, gap: 4 }}>
                <Text selectable style={{ fontWeight: "600" }}>
                  Notifications
                </Text>
                <Text selectable style={{ color: "#6B7280", lineHeight: 20 }}>
                  Limited to two nudges per day by default.
                </Text>
              </View>
              <Switch
                value={notificationEnabled}
                onValueChange={setNotificationEnabled}
              />
            </View>
          </View>
        </View>
      </Card>

      <Card>
        <View style={{ gap: 12 }}>
          <Text selectable style={{ fontSize: 16, fontWeight: "600" }}>
            Privacy and retention
          </Text>
          <Text selectable style={{ color: "#6B7280", lineHeight: 20 }}>
            Raw signals auto-delete after 14 days. Aggregates stay to improve
            your agency metrics.
          </Text>
        </View>
      </Card>

      <Card>
        <View style={{ gap: 12 }}>
          <Text selectable style={{ fontSize: 16, fontWeight: "600" }}>
            Experiments
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1, paddingRight: 12, gap: 4 }}>
              <Text selectable style={{ fontWeight: "600" }}>
                Micro-randomization
              </Text>
              <Text selectable style={{ color: "#6B7280", lineHeight: 20 }}>
                Test nudge timing to improve completion rates.
              </Text>
            </View>
            <Switch
              value={experimentsEnabled}
              onValueChange={setExperimentsEnabled}
            />
          </View>
        </View>
      </Card>
    </ScrollView>
  );
}
