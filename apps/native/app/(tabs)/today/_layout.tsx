import { Stack } from "expo-router/stack";
import { PlatformColor } from "react-native";

export default function TodayLayout() {
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: true,
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
        headerStyle: { backgroundColor: PlatformColor("systemGroupedBackground") },
        headerLargeStyle: {
          backgroundColor: PlatformColor("systemGroupedBackground"),
        },
        headerTitleStyle: { color: PlatformColor("label") },
        headerLargeTitleStyle: { color: PlatformColor("label") },
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen name="index" options={{ title: "Today" }} />
    </Stack>
  );
}
