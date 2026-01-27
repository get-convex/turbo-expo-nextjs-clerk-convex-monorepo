import path from "path";
import { getMockConfig } from "expo-router/testing-library";

const envAppRoot = process.env.EXPO_ROUTER_APP_ROOT;
const appRoot = envAppRoot
  ? path.isAbsolute(envAppRoot)
    ? envAppRoot
    : path.resolve(process.cwd(), envAppRoot)
  : path.resolve(__dirname, "../app");
const expectedRoutes = [
  "index",
  "start-sprint",
  "close-loop",
  "weekly-review",
  "settings",
];

const collectPaths = (screens: Record<string, unknown>): string[] => {
  const paths: string[] = [];

  Object.values(screens).forEach((screen) => {
    if (!screen || typeof screen !== "object") return;
    const screenRecord = screen as {
      path?: string;
      screens?: Record<string, unknown>;
    };

    if (typeof screenRecord.path === "string") {
      paths.push(screenRecord.path);
    }

    if (screenRecord.screens) {
      paths.push(...collectPaths(screenRecord.screens));
    }
  });

  return paths;
};

describe("expo-router route manifest", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it("registers the root index route and key screens", () => {
    const config = getMockConfig(appRoot, false);
    const root = config.screens?.__root;

    if (!root || typeof root !== "object" || !("screens" in root)) {
      throw new Error("expo-router root screens were not generated.");
    }

    const screens = root.screens as Record<string, unknown>;

    expectedRoutes.forEach((route) => {
      expect(screens).toHaveProperty(route);
    });

    const paths = collectPaths(screens);
    expect(paths).toContain("");
    expect(paths.length).toBeGreaterThan(0);
  });
});
