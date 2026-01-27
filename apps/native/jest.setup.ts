import "@testing-library/jest-native/extend-expect";
import "react-native-gesture-handler/jestSetup";
import "whatwg-fetch";
import fetchMock from "jest-fetch-mock";
import type { ReactNode } from "react";

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
