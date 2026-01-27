import { useEffect } from "react";
import { SplashScreen } from "expo-router";
import { Stack } from "expo-router/stack";
import { useFonts } from "expo-font";
import ConvexClientProvider from "../ConvexClientProvider";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    Bold: require("../src/assets/fonts/Inter-Bold.ttf"),
    SemiBold: require("../src/assets/fonts/Inter-SemiBold.ttf"),
    Medium: require("../src/assets/fonts/Inter-Medium.ttf"),
    Regular: require("../src/assets/fonts/Inter-Regular.ttf"),
    MBold: require("../src/assets/fonts/Montserrat-Bold.ttf"),
    MSemiBold: require("../src/assets/fonts/Montserrat-SemiBold.ttf"),
    MMedium: require("../src/assets/fonts/Montserrat-Medium.ttf"),
    MRegular: require("../src/assets/fonts/Montserrat-Regular.ttf"),
    MLight: require("../src/assets/fonts/Montserrat-Light.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      void SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ConvexClientProvider>
      <Stack
        screenOptions={{
          headerLargeTitle: true,
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: "SemiBold" },
          contentStyle: { backgroundColor: "#F5F2EB" },
        }}
      >
        <Stack.Screen name="index" options={{ title: "Today" }} />
        <Stack.Screen
          name="start-sprint"
          options={{
            title: "Start Sprint",
            presentation: "modal",
            headerLargeTitle: false,
          }}
        />
        <Stack.Screen
          name="close-loop"
          options={{
            title: "Close Loop",
            presentation: "modal",
            headerLargeTitle: false,
          }}
        />
        <Stack.Screen
          name="weekly-review"
          options={{ title: "Weekly Review", headerLargeTitle: false }}
        />
        <Stack.Screen
          name="settings"
          options={{ title: "Settings", headerLargeTitle: false }}
        />
      </Stack>
    </ConvexClientProvider>
  );
}
