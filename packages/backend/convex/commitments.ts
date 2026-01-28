import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserId, requireUserId } from "./auth";

const commitmentDoc = v.object({
  _id: v.id("commitments"),
  _creationTime: v.number(),
  userId: v.string(),
  title: v.string(),
  doneDefinition: v.optional(v.string()),
  estimatedMinutes: v.optional(v.number()),
  cue: v.optional(v.string()),
  starterStep: v.optional(v.string()),
  fallbackStep: v.optional(v.string()),
  valueLink: v.optional(v.string()),
  riskLevel: v.optional(v.string()),
  confidence: v.optional(v.number()),
  scheduledFor: v.string(),
  status: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
});

export const getForDate = query({
  args: {
    date: v.string(),
  },
  returns: v.union(v.null(), commitmentDoc),
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) return null;
    const commitment = await ctx.db
      .query("commitments")
      .withIndex("by_userId_and_scheduledFor", (q) =>
        q.eq("userId", userId).eq("scheduledFor", args.date)
      )
      .order("desc")
      .first();

    return commitment ?? null;
  },
});

export const upsertForDate = mutation({
  args: {
    date: v.string(),
    title: v.string(),
    doneDefinition: v.optional(v.string()),
    estimatedMinutes: v.optional(v.number()),
    cue: v.optional(v.string()),
    starterStep: v.optional(v.string()),
    fallbackStep: v.optional(v.string()),
    valueLink: v.optional(v.string()),
    riskLevel: v.optional(v.string()),
    confidence: v.optional(v.number()),
    status: v.optional(v.string()),
  },
  returns: v.id("commitments"),
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const now = Date.now();
    const title = args.title.trim();

    const existing = await ctx.db
      .query("commitments")
      .withIndex("by_userId_and_scheduledFor", (q) =>
        q.eq("userId", userId).eq("scheduledFor", args.date)
      )
      .order("desc")
      .first();

    const patch: {
      title: string;
      doneDefinition?: string;
      estimatedMinutes?: number;
      cue?: string;
      starterStep?: string;
      fallbackStep?: string;
      valueLink?: string;
      riskLevel?: string;
      confidence?: number;
      status?: string;
      updatedAt: number;
    } = {
      title,
      updatedAt: now,
    };

    if (args.doneDefinition !== undefined) patch.doneDefinition = args.doneDefinition;
    if (args.estimatedMinutes !== undefined) {
      patch.estimatedMinutes = args.estimatedMinutes;
    }
    if (args.cue !== undefined) patch.cue = args.cue;
    if (args.starterStep !== undefined) patch.starterStep = args.starterStep;
    if (args.fallbackStep !== undefined) patch.fallbackStep = args.fallbackStep;
    if (args.valueLink !== undefined) patch.valueLink = args.valueLink;
    if (args.riskLevel !== undefined) patch.riskLevel = args.riskLevel;
    if (args.confidence !== undefined) patch.confidence = args.confidence;
    if (args.status !== undefined) patch.status = args.status;

    if (existing) {
      await ctx.db.patch(existing._id, patch);
      return existing._id;
    }

    return await ctx.db.insert("commitments", {
      userId,
      scheduledFor: args.date,
      createdAt: now,
      ...patch,
    });
  },
});
