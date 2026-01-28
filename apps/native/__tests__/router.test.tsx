import path from "path";
import { renderRouter, screen, testRouter } from "expo-router/testing-library";

const envAppRoot = process.env.EXPO_ROUTER_APP_ROOT;
const appRoot = envAppRoot
  ? path.isAbsolute(envAppRoot)
    ? envAppRoot
    : path.resolve(process.cwd(), envAppRoot)
  : path.resolve(__dirname, "../app");

describe("expo-router navigation", () => {
  it("boots into Today and navigates to Start Sprint", () => {
    const router = renderRouter(appRoot);

    expect(router.getPathname()).toBe("/today");
    expect(router.getSegments()).not.toContain("+not-found");
    expect(screen.getByText("Commitment")).toBeTruthy();

    testRouter.navigate("/start-sprint");
    expect(screen.getByText("Sprint focus")).toBeTruthy();
  });

  it("navigates to Close Loop and Review", () => {
    renderRouter(appRoot);

    testRouter.navigate("/close-loop");
    expect(screen.getByText("Did you complete the commitment?")).toBeTruthy();

    testRouter.navigate("/review");
    expect(screen.getByText("Metrics")).toBeTruthy();
  });
});
