"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useConvexAuth, useMutation } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";

export default function UserSync() {
  const { user, isLoaded } = useUser();
  const { isAuthenticated, isLoading: isConvexAuthLoading } = useConvexAuth();
  const upsertCurrentUser = useMutation(api.users.upsertCurrentUser);
  const lastUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      lastUserIdRef.current = null;
      return;
    }

    if (isConvexAuthLoading || !isAuthenticated) return;
    if (lastUserIdRef.current === user.id) return;

    const payload: {
      name?: string;
      email?: string;
      imageUrl?: string;
    } = {};

    const name = user.fullName ?? user.username ?? undefined;
    const email = user.primaryEmailAddress?.emailAddress ?? undefined;
    const imageUrl = user.imageUrl ?? undefined;

    if (name) payload.name = name;
    if (email) payload.email = email;
    if (imageUrl) payload.imageUrl = imageUrl;

    lastUserIdRef.current = user.id;
    void upsertCurrentUser(payload).catch(() => {
      lastUserIdRef.current = null;
    });
  }, [isLoaded, isAuthenticated, isConvexAuthLoading, upsertCurrentUser, user]);

  return null;
}
