import { PlatformColor } from "react-native";

const isTest = process.env.NODE_ENV === "test";

export default function TabsLayout() {
  if (isTest) {
    const { Stack } = require("expo-router/stack");

    return (
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: PlatformColor("systemGroupedBackground"),
          },
        }}
      >
        <Stack.Screen name="today" options={{ title: "Today" }} />
        <Stack.Screen name="review" options={{ title: "Review" }} />
        <Stack.Screen name="settings" options={{ title: "Settings" }} />
      </Stack>
    );
  }

  const { Icon, Label, NativeTabs } = require("expo-router/unstable-native-tabs");

  return (
    <NativeTabs
      backgroundColor={PlatformColor("systemBackground")}
      iconColor={{
        default: PlatformColor("secondaryLabel"),
        selected: PlatformColor("label"),
      }}
      labelStyle={{
        default: { color: PlatformColor("secondaryLabel") },
        selected: { color: PlatformColor("label") },
      }}
      disableTransparentOnScrollEdge
    >
      <NativeTabs.Trigger name="today">
        <Label>Today</Label>
        <Icon sf="checkmark.circle.fill" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="review">
        <Label>Review</Label>
        <Icon sf="chart.bar.xaxis" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Label>Settings</Label>
        <Icon sf="gearshape" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
