import "@expo/metro-runtime";
import React from "react";
import { ExpoRoot } from "expo-router";
import { renderRootComponent } from "expo-router/build/renderRootComponent";

const importMode = process.env.EXPO_ROUTER_IMPORT_MODE ?? "sync";

const ctx = (require as any).context(
  "./app",
  true,
  /^(?:\.\/)(?!(?:(?:(?:.*\+api)|(?:\+html)|(?:\+middleware)))\.[tj]sx?$).*\.[tj]sx?$/,
  importMode
);

renderRootComponent(() => <ExpoRoot context={ctx} />);
