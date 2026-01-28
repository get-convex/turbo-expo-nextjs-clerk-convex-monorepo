import { Stack } from "expo-router/stack";
import { PlatformColor } from "react-native";

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: false,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: PlatformColor("systemGroupedBackground") },
        headerTitleStyle: { color: PlatformColor("label") },
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen name="index" options={{ title: "Settings" }} />
    </Stack>
  );
}
