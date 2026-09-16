import { v } from "convex/values";
import { internalAction, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

const DAY = 24 * 60 * 60 * 1000;

// Explicit opt-in and a development key keep this demo-only policy from
// accidentally deleting users when someone adopts the starter for a real app.
export const expireUsers = internalAction({
  args: { dryRun: v.optional(v.boolean()) },
  returns: v.object({ eligible: v.number(), deleted: v.number() }),
  handler: async (ctx, { dryRun = false }) => {
    if (process.env.DEMO_CLEANUP_ENABLED !== "true") {
      return { eligible: 0, deleted: 0 };
    }
    const key = process.env.CLERK_SECRET_KEY;
    if (!key?.startsWith("sk_test_")) {
      throw new Error("Demo cleanup requires a Clerk development secret key");
    }
    const headers = { Authorization: `Bearer ${key}` };
    const response = await fetch(
      "https://api.clerk.com/v1/users?limit=100&order_by=%2Bcreated_at",
      { headers },
    );
    if (!response.ok) throw new Error(`Clerk list failed: ${response.status}`);
    const users: unknown = await response.json();
    if (!Array.isArray(users)) throw new Error("Unexpected Clerk users response");
    const cutoff = Date.now() - DAY;
    const expired = users.filter((user) => {
      if (typeof user.id !== "string" || typeof user.created_at !== "number") {
        throw new Error("Clerk user is missing its ID or creation timestamp");
      }
      return user.created_at < cutoff;
    });
    if (dryRun) return { eligible: expired.length, deleted: 0 };

    let deleted = 0;
    for (const user of expired) {
      // Persist the cleanup job before the external deletion. It survives an
      // action crash or API failure, so deleting a Clerk user cannot orphan notes.
      // The delay also lets already-issued short-lived auth tokens expire.
      await ctx.runMutation(internal.demoCleanup.scheduleNotesCleanup, {
        userId: user.id,
      });
      const result = await fetch(
        `https://api.clerk.com/v1/users/${encodeURIComponent(user.id)}`,
        { method: "DELETE", headers },
      );
      if (!result.ok && result.status !== 404) {
        // Stop on errors, including rate limiting. The next cron retries users
        // still present in Clerk; always starting from offset zero avoids skips.
        throw new Error(`Clerk deletion failed: ${result.status}`);
      }
      deleted++;
    }
    return { eligible: expired.length, deleted };
  },
});

export const scheduleNotesCleanup = internalMutation({
  args: { userId: v.string() },
  returns: v.null(),
  handler: async (ctx, { userId }) => {
    await ctx.scheduler.runAfter(5 * 60 * 1000, internal.demoCleanup.deleteNotes, {
      userId,
    });
    return null;
  },
});

export const deleteNotes = internalMutation({
  args: { userId: v.string() },
  returns: v.null(),
  handler: async (ctx, { userId }) => {
    const notes = await ctx.db.query("notes")
      .withIndex("by_userId", (q) => q.eq("userId", userId)).take(100);
    for (const note of notes) await ctx.db.delete(note._id);
    if (notes.length === 100) {
      await ctx.scheduler.runAfter(0, internal.demoCleanup.deleteNotes, { userId });
    }
    return null;
  },
});
