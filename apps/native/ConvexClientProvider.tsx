"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import UserSync from "./UserSync";
import { useMemo, type ReactNode } from "react";

type ConvexClientProviderProps = {
  children: ReactNode;
};

export default function ConvexClientProvider({
  children,
}: ConvexClientProviderProps) {
  const isTest = process.env.NODE_ENV === "test";
  const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
  const convex = useMemo(() => {
    if (isTest) {
      return null;
    }
    if (!convexUrl) {
      throw new Error(
        "Missing EXPO_PUBLIC_CONVEX_URL. Set it in your environment."
      );
    }
    return new ConvexReactClient(convexUrl);
  }, [convexUrl, isTest]);

  if (isTest || !convex) {
    return <>{children}</>;
  }

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
