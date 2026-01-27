const fs = require("fs");
const path = require("path");

module.exports = function (api) {
  api.cache(true);
  const defaultRoot = path.resolve(__dirname, "app");
  const rawRoot = process.env.EXPO_ROUTER_APP_ROOT;
  const resolvedRoot = rawRoot
    ? path.isAbsolute(rawRoot)
      ? rawRoot
      : path.resolve(__dirname, rawRoot)
    : defaultRoot;
  let appRoot = defaultRoot;
  try {
    appRoot = fs.existsSync(resolvedRoot)
      ? fs.realpathSync(resolvedRoot)
      : fs.realpathSync(defaultRoot);
  } catch {
    appRoot = resolvedRoot;
  }
  const importMode = process.env.EXPO_ROUTER_IMPORT_MODE ?? "sync";

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      function inlineExpoRouterEnv({ types: t }) {
        return {
          name: "inline-expo-router-env",
          visitor: {
            MemberExpression(memberPath) {
              if (!memberPath.isReferenced()) {
                return;
              }
              if (memberPath.matchesPattern("process.env.EXPO_ROUTER_APP_ROOT")) {
                memberPath.replaceWith(t.stringLiteral(appRoot));
              }
              if (
                memberPath.matchesPattern(
                  "process.env.EXPO_ROUTER_IMPORT_MODE"
                )
              ) {
                memberPath.replaceWith(t.stringLiteral(importMode));
              }
            },
          },
        };
      },
    ],
  };
};
