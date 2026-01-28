import { Stack } from "expo-router/stack";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { PlatformColor, Pressable, Text } from "react-native";
import ConvexClientProvider from "../ConvexClientProvider";

const systemGroupedBackground = PlatformColor("systemGroupedBackground") as unknown as string;
const labelColor = PlatformColor("label") as unknown as string;
const isIOS = process.env.EXPO_OS === "ios";

export default function RootLayout() {
  const router = useRouter();

  const closeButton = () => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Close"
      testID="modal-close"
      onPress={() => {
        if (router.canDismiss()) {
          router.dismiss();
        } else if (router.canGoBack()) {
          router.back();
        } else {
          router.replace("/today");
        }
      }}
      hitSlop={10}
      style={({ pressed }) => [
        {
          width: 44,
          height: 44,
          borderRadius: 22,
          alignItems: "center",
          justifyContent: "center",
        },
        pressed && { backgroundColor: PlatformColor("tertiarySystemFill") },
      ]}
    >
      {isIOS ? (
        <SymbolView name="xmark" size={16} tintColor={PlatformColor("label")} />
      ) : (
        <Text selectable style={{ fontSize: 15, fontWeight: "600", color: labelColor }}>
          Close
        </Text>
      )}
    </Pressable>
  );

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
            headerRight: closeButton,
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
            headerRight: closeButton,
          }}
        />
      </Stack>
    </ConvexClientProvider>
  );
}
