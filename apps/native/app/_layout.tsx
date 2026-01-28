import { Stack } from "expo-router/stack";
import { PlatformColor } from "react-native";
import ConvexClientProvider from "../ConvexClientProvider";

const systemGroupedBackground = PlatformColor("systemGroupedBackground") as unknown as string;
const labelColor = PlatformColor("label") as unknown as string;

export default function RootLayout() {
  return (
    <ConvexClientProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: systemGroupedBackground,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(auth)/sign-in"
          options={{
            title: "Sign In",
            presentation: "modal",
            headerShown: true,
            headerLargeTitle: false,
            headerShadowVisible: false,
            headerBackButtonDisplayMode: "minimal",
            headerStyle: {
              backgroundColor: systemGroupedBackground,
            },
            headerTitleStyle: { color: labelColor },
          }}
        />
        <Stack.Screen
          name="(modals)/start-sprint"
          options={{
            title: "Focus session",
            presentation: "formSheet",
            headerShown: true,
            headerLargeTitle: false,
            headerShadowVisible: false,
            headerBackButtonDisplayMode: "minimal",
            headerStyle: {
              backgroundColor: systemGroupedBackground,
            },
            headerTitleStyle: { color: labelColor },
            sheetGrabberVisible: true,
          }}
        />
        <Stack.Screen
          name="(modals)/close-loop"
          options={{
            title: "Reflect",
            presentation: "formSheet",
            headerShown: true,
            headerLargeTitle: false,
            headerShadowVisible: false,
            headerBackButtonDisplayMode: "minimal",
            headerStyle: {
              backgroundColor: systemGroupedBackground,
            },
            headerTitleStyle: { color: labelColor },
            sheetGrabberVisible: true,
          }}
        />
      </Stack>
    </ConvexClientProvider>
  );
}
