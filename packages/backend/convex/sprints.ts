import { mutation } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { requireUserId } from "./auth";

export const startSprint = mutation({
  args: {
    commitmentId: v.optional(v.id("commitments")),
    durationMinutes: v.optional(v.number()),
    steps: v.optional(
      v.array(
        v.object({
          id: v.string(),
          instruction: v.string(),
          durationMinutes: v.number(),
          successCheck: v.optional(v.string()),
        })
      )
    ),
  },
  returns: v.id("sprints"),
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const now = Date.now();

    const payload: {
      userId: string;
      commitmentId?: Id<"commitments">;
      startedAt: number;
      durationMinutes?: number;
      steps?: {
        id: string;
        instruction: string;
        durationMinutes: number;
        successCheck?: string;
      }[];
    } = {
      userId,
      startedAt: now,
    };

    if (args.commitmentId !== undefined) {
      payload.commitmentId = args.commitmentId;
    }
    if (args.durationMinutes !== undefined) {
      payload.durationMinutes = args.durationMinutes;
    }
    if (args.steps !== undefined) {
      payload.steps = args.steps;
    }

    return await ctx.db.insert("sprints", payload);
  },
});

export const endSprint = mutation({
  args: {
    sprintId: v.id("sprints"),
    outcome: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireUserId(ctx);
    const now = Date.now();
    const patch: { endedAt: number; outcome?: string } = { endedAt: now };
    if (args.outcome !== undefined) {
      patch.outcome = args.outcome;
    }
    await ctx.db.patch(args.sprintId, patch);
    return null;
  },
});
