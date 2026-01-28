"use client";

import { useMemo, type ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import UserSync from "./UserSync";

type ConvexClientProviderProps = {
  children: ReactNode;
};

function ConvexClientProviderInner({ children }: ConvexClientProviderProps) {
  const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
  const convex = useMemo(() => {
    if (!convexUrl) {
      throw new Error(
        "Missing EXPO_PUBLIC_CONVEX_URL. Set it in your environment."
      );
    }
    return new ConvexReactClient(convexUrl);
  }, [convexUrl]);

  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <UserSync />
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

export default function ConvexClientProvider({
  children,
}: ConvexClientProviderProps) {
  if (process.env.NODE_ENV === "test") {
    return <>{children}</>;
  }

  return <ConvexClientProviderInner>{children}</ConvexClientProviderInner>;
}
