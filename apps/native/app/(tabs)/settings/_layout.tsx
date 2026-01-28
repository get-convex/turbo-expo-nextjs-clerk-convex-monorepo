import { Stack } from "expo-router/stack";
import { PlatformColor } from "react-native";

const systemGroupedBackground = PlatformColor("systemGroupedBackground") as unknown as string;
const labelColor = PlatformColor("label") as unknown as string;

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: false,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: systemGroupedBackground },
        headerTitleStyle: { color: labelColor },
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen name="index" options={{ title: "Settings" }} />
      <Stack.Screen name="advanced" options={{ title: "Advanced" }} />
      <Stack.Screen name="planned-features" options={{ title: "Planned features" }} />
      <Stack.Screen name="connections/[source]" options={{ title: "Connection" }} />
    </Stack>
  );
}
