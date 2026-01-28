import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_CHECKIN_RETENTION_DAYS = 14;
const DEFAULT_NOTIFICATION_RETENTION_DAYS = 14;

export const purgeExpiredData = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const now = Date.now();
    const users = await ctx.db.query("users").collect();

    for (const user of users) {
      const userId = user.clerkId;
      const notificationSource = await ctx.db
        .query("data_sources")
        .withIndex("by_userId_and_source", (q) =>
          q.eq("userId", userId).eq("source", "notifications")
        )
        .unique();

      const notificationRetentionDays =
        notificationSource?.retentionDays ?? DEFAULT_NOTIFICATION_RETENTION_DAYS;
      const notificationCutoff = now - notificationRetentionDays * DAY_MS;

      const oldNudges = await ctx.db
        .query("nudges")
        .withIndex("by_userId_and_createdAt", (q) =>
          q.eq("userId", userId).lt("createdAt", notificationCutoff)
        )
        .collect();

      for (const nudge of oldNudges) {
        await ctx.db.delete(nudge._id);
      }

      const checkinCutoff = now - DEFAULT_CHECKIN_RETENTION_DAYS * DAY_MS;
      const oldCheckins = await ctx.db
        .query("checkins")
        .withIndex("by_userId_and_createdAt", (q) =>
          q.eq("userId", userId).lt("createdAt", checkinCutoff)
        )
        .collect();

      for (const checkin of oldCheckins) {
        await ctx.db.delete(checkin._id);
      }
    }

    return null;
  },
});
