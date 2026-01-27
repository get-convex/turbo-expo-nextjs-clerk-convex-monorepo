import path from "path";
import { renderRouter, screen, testRouter } from "expo-router/testing-library";

const envAppRoot = process.env.EXPO_ROUTER_APP_ROOT;
const appRoot = envAppRoot
  ? path.isAbsolute(envAppRoot)
    ? envAppRoot
    : path.resolve(process.cwd(), envAppRoot)
  : path.resolve(__dirname, "../app");

describe("expo-router navigation", () => {
  it("boots into the home route and navigates to Start Sprint", () => {
    const router = renderRouter(appRoot);

    expect(router.getPathname()).toBe("/");
    expect(router.getSegments()).not.toContain("+not-found");
    expect(screen.getByText("One commitment, done today")).toBeTruthy();

    testRouter.navigate("/start-sprint");
    expect(screen.getByText("Sprint focus")).toBeTruthy();
  });

  it("navigates to Close Loop and Weekly Review", () => {
    renderRouter(appRoot);

    testRouter.navigate("/close-loop");
    expect(
      screen.getByText("Did you complete the commitment?")
    ).toBeTruthy();

    testRouter.navigate("/weekly-review");
    expect(screen.getByText("Outcome dashboard")).toBeTruthy();
  });
});
