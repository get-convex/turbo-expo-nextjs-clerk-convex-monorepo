import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const upsertCurrentUser = mutation({
  args: {
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  returns: v.id("users"),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const clerkId = identity.subject;

    const name = args.name ?? identity.name ?? undefined;
    const email = args.email ?? identity.email ?? undefined;
    const imageUrl = args.imageUrl ?? identity.pictureUrl ?? undefined;

    const patch: {
      name?: string;
      email?: string;
      imageUrl?: string;
    } = {};

    if (name) patch.name = name;
    if (email) patch.email = email;
    if (imageUrl) patch.imageUrl = imageUrl;

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .unique();

    if (existing) {
      if (Object.keys(patch).length > 0) {
        await ctx.db.patch(existing._id, patch);
      }
      return existing._id;
    }

    return await ctx.db.insert("users", {
      clerkId,
      ...patch,
    });
  },
});
