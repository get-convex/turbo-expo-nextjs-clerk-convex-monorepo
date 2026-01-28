import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserId, requireUserId } from "./auth";

const dataSourceDefaults = [
  {
    source: "calendar",
    enabled: true,
    retentionDays: 30,
    scopes: ["read:events"],
  },
  {
    source: "location",
    enabled: false,
    retentionDays: 7,
    scopes: ["whenInUse"],
  },
  {
    source: "notifications",
    enabled: true,
    retentionDays: 14,
    scopes: ["alerts"],
  },
  {
    source: "health",
    enabled: false,
    retentionDays: 30,
    scopes: ["activity"],
  },
];

const dataSourceDoc = v.object({
  _id: v.id("data_sources"),
  _creationTime: v.number(),
  userId: v.string(),
  source: v.string(),
  enabled: v.boolean(),
  retentionDays: v.number(),
  scopes: v.optional(v.array(v.string())),
  createdAt: v.number(),
  updatedAt: v.number(),
});

export const listDataSources = query({
  args: {},
  returns: v.array(dataSourceDoc),
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];
    const sources = await ctx.db
      .query("data_sources")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    return sources.sort((a, b) => a.source.localeCompare(b.source));
  },
});

export const initializeDataSources = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const existing = await ctx.db
      .query("data_sources")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    const existingSources = new Set(existing.map((item) => item.source));
    const now = Date.now();

    for (const source of dataSourceDefaults) {
      if (existingSources.has(source.source)) continue;
      await ctx.db.insert("data_sources", {
        userId,
        source: source.source,
        enabled: source.enabled,
        retentionDays: source.retentionDays,
        scopes: source.scopes,
        createdAt: now,
        updatedAt: now,
      });
    }

    return null;
  },
});

export const updateDataSource = mutation({
  args: {
    source: v.string(),
    enabled: v.optional(v.boolean()),
    retentionDays: v.optional(v.number()),
    scopes: v.optional(v.array(v.string())),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const existing = await ctx.db
      .query("data_sources")
      .withIndex("by_userId_and_source", (q) =>
        q.eq("userId", userId).eq("source", args.source)
      )
      .unique();

    const now = Date.now();
    const defaults = dataSourceDefaults.find((item) => item.source === args.source);

    if (!existing) {
      await ctx.db.insert("data_sources", {
        userId,
        source: args.source,
        enabled: args.enabled ?? defaults?.enabled ?? false,
        retentionDays: args.retentionDays ?? defaults?.retentionDays ?? 14,
        scopes: args.scopes ?? defaults?.scopes ?? [],
        createdAt: now,
        updatedAt: now,
      });
      return null;
    }

    const patch: {
      enabled?: boolean;
      retentionDays?: number;
      scopes?: string[];
      updatedAt: number;
    } = {
      updatedAt: now,
    };

    if (args.enabled !== undefined) {
      patch.enabled = args.enabled;
    }
    if (args.retentionDays !== undefined) {
      patch.retentionDays = args.retentionDays;
    }
    if (args.scopes !== undefined) {
      patch.scopes = args.scopes;
    }

    await ctx.db.patch(existing._id, patch);
    return null;
  },
});
