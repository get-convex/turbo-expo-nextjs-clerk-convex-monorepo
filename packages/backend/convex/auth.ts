import { type Auth } from "convex/server";

export async function getUserId(ctx: { auth: Auth }) {
  return (await ctx.auth.getUserIdentity())?.subject ?? null;
}

export async function requireUserId(ctx: { auth: Auth }) {
  const userId = await getUserId(ctx);
  if (!userId) {
    throw new Error("Not authenticated");
  }
  return userId;
}
