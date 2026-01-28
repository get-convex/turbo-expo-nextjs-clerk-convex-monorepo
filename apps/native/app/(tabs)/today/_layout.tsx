import { Stack } from "expo-router/stack";
import { PlatformColor } from "react-native";

const systemGroupedBackground = PlatformColor("systemGroupedBackground") as unknown as string;
const labelColor = PlatformColor("label") as unknown as string;

export default function TodayLayout() {
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: true,
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
        headerStyle: { backgroundColor: systemGroupedBackground },
        headerLargeStyle: {
          backgroundColor: systemGroupedBackground,
        },
        headerTitleStyle: { color: labelColor },
        headerLargeTitleStyle: { color: labelColor },
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen name="index" options={{ title: "Today" }} />
    </Stack>
  );
}
