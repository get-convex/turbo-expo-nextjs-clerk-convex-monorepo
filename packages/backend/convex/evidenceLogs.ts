import { mutation } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { requireUserId } from "./auth";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const outcomeWeight = (label: string) => {
  const normalized = label.toLowerCase();
  if (normalized === "yes") return 1;
  if (normalized === "partial") return 0.5;
  return 0;
};

export const logEvidence = mutation({
  args: {
    commitmentId: v.optional(v.id("commitments")),
    outcomeLabel: v.string(),
    blockerTags: v.array(v.string()),
    learnings: v.optional(v.string()),
    nextStep: v.optional(v.string()),
  },
  returns: v.id("evidence_logs"),
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const now = Date.now();

    const evidencePayload: {
      userId: string;
      commitmentId?: Id<"commitments">;
      outcomeLabel: string;
      blockerTags: string[];
      learnings?: string;
      nextStep?: string;
      createdAt: number;
    } = {
      userId,
      outcomeLabel: args.outcomeLabel,
      blockerTags: args.blockerTags,
      createdAt: now,
    };

    if (args.commitmentId !== undefined) {
      evidencePayload.commitmentId = args.commitmentId;
    }
    if (args.learnings !== undefined) {
      evidencePayload.learnings = args.learnings;
    }
    if (args.nextStep !== undefined) {
      evidencePayload.nextStep = args.nextStep;
    }

    const evidenceId = await ctx.db.insert("evidence_logs", evidencePayload);

    const uniqueBlockers = Array.from(
      new Set(args.blockerTags.map((tag) => tag.trim()).filter(Boolean))
    );

    for (const blocker of uniqueBlockers) {
      const existing = await ctx.db
        .query("barriers")
        .withIndex("by_userId_and_label", (q) =>
          q.eq("userId", userId).eq("label", blocker)
        )
        .unique();

      if (existing) {
        await ctx.db.patch(existing._id, {
          frequency: existing.frequency + 1,
          lastSeenAt: now,
        });
      } else {
        await ctx.db.insert("barriers", {
          userId,
          label: blocker,
          frequency: 1,
          lastSeenAt: now,
        });
      }
    }

    if (args.commitmentId) {
      const normalized = args.outcomeLabel.toLowerCase();
      const status =
        normalized === "yes"
          ? "completed"
          : normalized === "partial"
          ? "partial"
          : "not_yet";
      await ctx.db.patch(args.commitmentId, {
        status,
        updatedAt: now,
      });
    }

    const weekStart = now - WEEK_MS;
    const recentLogs = await ctx.db
      .query("evidence_logs")
      .withIndex("by_userId_and_createdAt", (q) =>
        q.eq("userId", userId).gte("createdAt", weekStart)
      )
      .collect();

    const total = recentLogs.length;
    const completionScore = recentLogs.reduce((sum, log) => {
      return sum + outcomeWeight(log.outcomeLabel);
    }, 0);
    const completionRateTrend = total > 0 ? completionScore / total : 0;

    const metrics = await ctx.db
      .query("metrics")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (metrics) {
      await ctx.db.patch(metrics._id, {
        completionRateTrend,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("metrics", {
        userId,
        completionRateTrend,
        updatedAt: now,
      });
    }

    return evidenceId;
  },
});
