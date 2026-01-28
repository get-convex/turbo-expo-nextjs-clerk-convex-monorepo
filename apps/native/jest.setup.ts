import "@testing-library/jest-native/extend-expect";
import "react-native-gesture-handler/jestSetup";
import "whatwg-fetch";
import fetchMock from "jest-fetch-mock";
import type { ReactNode } from "react";

jest.mock("@clerk/clerk-expo", () => ({
  ClerkProvider: ({ children }: { children: ReactNode }) => children,
  useAuth: () => ({ isLoaded: true, isSignedIn: true }),
  useOAuth: () => ({ startOAuthFlow: jest.fn() }),
  useUser: () => ({ user: null, isLoaded: true }),
}));

jest.mock("expo-symbols", () => ({
  SymbolView: () => null,
}));

jest.mock("convex/react", () => ({
  useQuery: jest.fn(() => undefined),
  useMutation: jest.fn(() => () => Promise.resolve(null)),
  useConvexAuth: jest.fn(() => ({ isAuthenticated: false, isLoading: false })),
  ConvexReactClient: jest.fn(),
}));

jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock("expo-font", () => ({
  useFonts: () => [true],
}));

jest.mock(
  "react-native-screens",
  () => ({
    enableScreens: jest.fn(),
    Screen: ({ children }: { children: ReactNode }) => children,
    ScreenStack: ({ children }: { children: ReactNode }) => children,
    ScreenStackItem: ({ children }: { children: ReactNode }) => children,
  }),
  { virtual: true }
);

jest.mock(
  "react-native-screens/native-stack",
  () => ({
    createNativeStackNavigator: jest.fn(),
  }),
  { virtual: true }
);

jest.mock("@react-navigation/native-stack", () => {
  const React = require("react");

  return {
    createNativeStackNavigator: () => ({
      Navigator: ({ children }: { children: ReactNode }) => children,
      Screen: ({ children }: { children: ReactNode }) => children,
      Group: ({ children }: { children: ReactNode }) => children,
    }),
    NativeStackView: ({ state, descriptors }: any) => {
      const route = state?.routes?.[state?.index ?? 0];
      const descriptor = route ? descriptors?.[route.key] : null;
      return descriptor?.render ? descriptor.render() : null;
    },
  };
});

global.__reanimatedWorkletInit = () => {};

fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.resetMocks();
});

afterEach(() => {
  try {
    jest.runOnlyPendingTimers();
  } catch {
    // Ignore if fake timers were not enabled.
  }
  jest.useRealTimers();
});
