import { query } from "./_generated/server";
import { v } from "convex/values";
import { getUserId } from "./auth";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const outcomeWeight = (label: string) => {
  const normalized = label.toLowerCase();
  if (normalized === "yes") return 1;
  if (normalized === "partial") return 0.5;
  return 0;
};

const weeklyMomentumDoc = v.object({
  completed: v.number(),
  total: v.number(),
  completionRate: v.number(),
  updatedAt: v.optional(v.number()),
});

const reviewSnapshotDoc = v.object({
  completionRate: v.number(),
  perceivedControl: v.union(v.number(), v.null()),
  automaticity: v.union(v.number(), v.null()),
  barrierLabel: v.union(v.string(), v.null()),
  identityEvidence: v.union(v.string(), v.null()),
});

export const getWeeklyMomentum = query({
  args: {},
  returns: weeklyMomentumDoc,
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      return { completed: 0, total: 0, completionRate: 0 };
    }

    const now = Date.now();
    const weekStart = now - WEEK_MS;
    const recentLogs = await ctx.db
      .query("evidence_logs")
      .withIndex("by_userId_and_createdAt", (q) =>
        q.eq("userId", userId).gte("createdAt", weekStart)
      )
      .collect();

    const total = recentLogs.length;
    const completed = recentLogs.reduce(
      (sum, log) => sum + outcomeWeight(log.outcomeLabel),
      0
    );
    const completionRate = total > 0 ? completed / total : 0;

    const metrics = await ctx.db
      .query("metrics")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    return {
      completed,
      total,
      completionRate,
      updatedAt: metrics?.updatedAt,
    };
  },
});

export const getReviewSnapshot = query({
  args: {},
  returns: reviewSnapshotDoc,
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      return {
        completionRate: 0,
        perceivedControl: null,
        automaticity: null,
        barrierLabel: null,
        identityEvidence: null,
      };
    }

    const now = Date.now();
    const weekStart = now - WEEK_MS;
    const recentLogs = await ctx.db
      .query("evidence_logs")
      .withIndex("by_userId_and_createdAt", (q) =>
        q.eq("userId", userId).gte("createdAt", weekStart)
      )
      .collect();

    const total = recentLogs.length;
    const completed = recentLogs.reduce(
      (sum, log) => sum + outcomeWeight(log.outcomeLabel),
      0
    );
    const completionRate = total > 0 ? completed / total : 0;

    const metrics = await ctx.db
      .query("metrics")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    const topBarrier = await ctx.db
      .query("barriers")
      .withIndex("by_userId_and_frequency", (q) => q.eq("userId", userId))
      .order("desc")
      .first();

    const profile = await ctx.db
      .query("profile")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    const identityEvidence = profile?.identityStatements?.length
      ? profile.identityStatements[profile.identityStatements.length - 1]
      : null;

    return {
      completionRate,
      perceivedControl: metrics?.perceivedControl ?? null,
      automaticity: metrics?.automaticity ?? null,
      barrierLabel: topBarrier?.label ?? null,
      identityEvidence,
    };
  },
});
