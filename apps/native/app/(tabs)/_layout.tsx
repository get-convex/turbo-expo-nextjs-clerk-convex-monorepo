import { Redirect } from "expo-router";
import { PlatformColor, View, ActivityIndicator } from "react-native";
import { useAuth } from "@clerk/clerk-expo";

const isTest = process.env.NODE_ENV === "test";

export default function TabsLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: PlatformColor("systemGroupedBackground"),
        }}
      >
        <ActivityIndicator color={PlatformColor("label")} />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/sign-in" />;
  }

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
