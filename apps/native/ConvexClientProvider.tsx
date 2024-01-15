"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";

const convex = new ConvexReactClient(
  "https://giddy-kookabura-511.convex.cloud"
);

export default function ConvexClientProvider({ children }) {
  return (
    <ClerkProvider publishableKey="pk_test_YW1wbGUtY2FtZWwtMC5jbGVyay5hY2NvdW50cy5kZXYk">
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
