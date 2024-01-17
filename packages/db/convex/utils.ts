export function missingEnvVariableUrl(envVarName: string, whereToGet: string) {
  const deploymentName = process.env.CONVEX_CLOUD_URL?.slice(8).replace(
    ".convex.cloud",
    ""
  );
  return (
    `\n  Missing ${envVarName} in environment variables.\n\n` +
    `  Get it from ${whereToGet} .\n` +
    "  Paste it on the Convex dashboard:\n" +
    "  https://dashboard.convex.dev/d/" +
    deploymentName +
    `/settings?var=${envVarName}`
  );
  return;
}
