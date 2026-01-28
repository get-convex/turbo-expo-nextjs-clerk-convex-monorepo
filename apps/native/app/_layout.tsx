import { Stack } from "expo-router/stack";
import { PlatformColor } from "react-native";
import ConvexClientProvider from "../ConvexClientProvider";

export default function RootLayout() {
  return (
    <ConvexClientProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: PlatformColor("systemGroupedBackground"),
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(modals)/start-sprint"
          options={{
            title: "Start Sprint",
            presentation: "formSheet",
            headerShown: true,
            headerLargeTitle: false,
            headerShadowVisible: false,
            headerBackButtonDisplayMode: "minimal",
            headerStyle: {
              backgroundColor: PlatformColor("systemGroupedBackground"),
            },
            headerTitleStyle: { color: PlatformColor("label") },
            sheetGrabberVisible: true,
          }}
        />
        <Stack.Screen
          name="(modals)/close-loop"
          options={{
            title: "Close Loop",
            presentation: "formSheet",
            headerShown: true,
            headerLargeTitle: false,
            headerShadowVisible: false,
            headerBackButtonDisplayMode: "minimal",
            headerStyle: {
              backgroundColor: PlatformColor("systemGroupedBackground"),
            },
            headerTitleStyle: { color: PlatformColor("label") },
            sheetGrabberVisible: true,
          }}
        />
      </Stack>
    </ConvexClientProvider>
  );
}
