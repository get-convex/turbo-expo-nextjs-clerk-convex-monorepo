import { View, StatusBar, Platform } from "react-native";
import { useFonts } from "expo-font";
import { LogBox } from "react-native";
import Navigation from "./src/navigation/Navigation";
import ConvexClientProvider from "./ConvexClientProvider";

export default function App() {
  LogBox.ignoreLogs(["Warning: ..."]);
  LogBox.ignoreAllLogs();

  const [loaded] = useFonts({
    Bold: require("./src/assets/fonts/Inter-Bold.ttf"),
    SemiBold: require("./src/assets/fonts/Inter-SemiBold.ttf"),
    Medium: require("./src/assets/fonts/Inter-Medium.ttf"),
    Regular: require("./src/assets/fonts/Inter-Regular.ttf"),

    MBold: require("./src/assets/fonts/Montserrat-Bold.ttf"),
    MSemiBold: require("./src/assets/fonts/Montserrat-SemiBold.ttf"),
    MMedium: require("./src/assets/fonts/Montserrat-Medium.ttf"),
    MRegular: require("./src/assets/fonts/Montserrat-Regular.ttf"),
    MLight: require("./src/assets/fonts/Montserrat-Light.ttf"),

    PPBold: require("./src/assets/fonts/PPPangramSansCompact-Bold.ttf"),
    PPSemibold: require("./src/assets/fonts/PPPangramSansCompact-Semibold.ttf"),
    PPMedium: require("./src/assets/fonts/PPPangramSansCompact-Medium.ttf"),
    PPObjectBold: require("./src/assets/fonts/PPObjectSans-Bold.ttf"),
  });
  if (!loaded) {
    return false;
  }

  return (
    <ConvexClientProvider>
      <View style={{ flex: 1 }}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#FFFEFE"
        />
        <Navigation />
      </View>
    </ConvexClientProvider>
  );
}
