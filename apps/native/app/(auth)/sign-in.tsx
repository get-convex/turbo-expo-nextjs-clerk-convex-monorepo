import { useMemo, useState, type ComponentProps } from "react";
import { Redirect, useRouter } from "expo-router";
import {
  ActivityIndicator,
  PlatformColor,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SymbolView } from "expo-symbols";
import { useAuth, useOAuth } from "@clerk/clerk-expo";
import Section from "../../src/components/section";

const isIOS = process.env.EXPO_OS === "ios";

type Provider = "apple" | "google" | null;

type SymbolName = ComponentProps<typeof SymbolView>["name"];

type AuthButtonProps = {
  label: string;
  symbol: SymbolName;
  onPress: () => void;
  disabled?: boolean;
};

function AuthButton({ label, symbol, onPress, disabled }: AuthButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        {
          minHeight: 48,
          paddingHorizontal: 16,
          borderRadius: 14,
          borderCurve: "continuous",
          borderWidth: 1,
          borderColor: PlatformColor("separator"),
          backgroundColor: PlatformColor("secondarySystemBackground"),
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        },
        pressed && { opacity: 0.9 },
        disabled && { opacity: 0.5 },
      ]}
    >
      <SymbolView name={symbol} size={18} tintColor={PlatformColor("label")} />
      <Text
        selectable
        style={{ fontSize: 16, fontWeight: "600", color: PlatformColor("label") }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function SignInScreen() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { startOAuthFlow: startGoogleAuthFlow } = useOAuth({
    strategy: "oauth_google",
  });
  const { startOAuthFlow: startAppleAuthFlow } = useOAuth({
    strategy: "oauth_apple",
  });

  const [activeProvider, setActiveProvider] = useState<Provider>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canPress = useMemo(() => isLoaded && !activeProvider, [activeProvider, isLoaded]);

  if (isLoaded && isSignedIn) {
    return <Redirect href="/today" />;
  }

  const handleOAuth = async (provider: Provider) => {
    if (!provider || !canPress) return;
    setActiveProvider(provider);
    setErrorMessage(null);
    try {
      const startFlow = provider === "apple" ? startAppleAuthFlow : startGoogleAuthFlow;
      const { createdSessionId, setActive } = await startFlow();
      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        router.replace("/today");
      }
    } catch (error) {
      console.error("OAuth error", error);
      setErrorMessage("Sign in failed. Please try again.");
    } finally {
      setActiveProvider(null);
    }
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: PlatformColor("systemGroupedBackground") }}
      contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 32 }}
    >
      <Section title="Welcome">
        <View style={{ padding: 16, gap: 12 }}>
          <Text
            selectable
            style={{ fontSize: 17, color: PlatformColor("label"), lineHeight: 22 }}
          >
            Sign in to sync your commitments, reflections, and settings across devices.
          </Text>
          <Text
            selectable
            style={{ fontSize: 14, color: PlatformColor("secondaryLabel"), lineHeight: 20 }}
          >
            We store only the data you choose to share and respect your retention limits.
          </Text>
        </View>
      </Section>

      <Section title="Continue with">
        <View style={{ padding: 16, gap: 12 }}>
          {isIOS ? (
            <AuthButton
              label={activeProvider === "apple" ? "Connecting..." : "Apple"}
              symbol="applelogo"
              onPress={() => handleOAuth("apple")}
              disabled={!canPress}
            />
          ) : null}
          <AuthButton
            label={activeProvider === "google" ? "Connecting..." : "Google"}
            symbol="globe"
            onPress={() => handleOAuth("google")}
            disabled={!canPress}
          />
          {!isLoaded ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <ActivityIndicator color={PlatformColor("label")} />
              <Text selectable style={{ color: PlatformColor("secondaryLabel") }}>
                Preparing sign-in...
              </Text>
            </View>
          ) : null}
          {errorMessage ? (
            <Text selectable style={{ color: PlatformColor("systemRed") }}>
              {errorMessage}
            </Text>
          ) : null}
        </View>
      </Section>

      <Text
        selectable
        style={{ fontSize: 13, color: PlatformColor("secondaryLabel"), lineHeight: 18 }}
      >
        You can continue in read-only mode, but editing requires sign-in.
      </Text>
    </ScrollView>
  );
}
