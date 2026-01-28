import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  }).index("by_clerk_id", ["clerkId"]),
  notes: defineTable({
    userId: v.string(),
    title: v.string(),
    content: v.string(),
    summary: v.optional(v.string()),
  }),
  profile: defineTable({
    userId: v.string(),
    values: v.array(v.string()),
    goals: v.array(v.string()),
    constraints: v.array(v.string()),
    identityStatements: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),
  checkins: defineTable({
    userId: v.string(),
    energy: v.optional(v.number()),
    focus: v.optional(v.number()),
    mood: v.optional(v.number()),
    availability: v.optional(v.number()),
    confidence: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_createdAt", ["userId", "createdAt"]),
  commitments: defineTable({
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
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_scheduledFor", ["userId", "scheduledFor"]),
  if_then_plans: defineTable({
    userId: v.string(),
    commitmentId: v.optional(v.id("commitments")),
    cue: v.string(),
    starterStep: v.string(),
    fallbackPlan: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_commitmentId", ["userId", "commitmentId"]),
  sprints: defineTable({
    userId: v.string(),
    commitmentId: v.optional(v.id("commitments")),
    startedAt: v.number(),
    endedAt: v.optional(v.number()),
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
    outcome: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_startedAt", ["userId", "startedAt"]),
  evidence_logs: defineTable({
    userId: v.string(),
    commitmentId: v.optional(v.id("commitments")),
    outcomeLabel: v.string(),
    blockerTags: v.array(v.string()),
    learnings: v.optional(v.string()),
    nextStep: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_createdAt", ["userId", "createdAt"]),
  barriers: defineTable({
    userId: v.string(),
    label: v.string(),
    frequency: v.number(),
    lastSeenAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_label", ["userId", "label"])
    .index("by_userId_and_frequency", ["userId", "frequency"]),
  nudges: defineTable({
    userId: v.string(),
    decisionPoint: v.string(),
    type: v.string(),
    deliveredAt: v.optional(v.number()),
    actedAt: v.optional(v.number()),
    status: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_decisionPoint", ["userId", "decisionPoint"])
    .index("by_userId_and_createdAt", ["userId", "createdAt"]),
  metrics: defineTable({
    userId: v.string(),
    selfEfficacy: v.optional(v.number()),
    perceivedControl: v.optional(v.number()),
    automaticity: v.optional(v.number()),
    completionRateTrend: v.optional(v.number()),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),
  experiments: defineTable({
    userId: v.string(),
    baselineStart: v.optional(v.number()),
    baselineEnd: v.optional(v.number()),
    assignments: v.optional(v.record(v.string(), v.string())),
    microRandomizationEnabled: v.boolean(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),
  data_sources: defineTable({
    userId: v.string(),
    source: v.string(),
    enabled: v.boolean(),
    retentionDays: v.number(),
    scopes: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_source", ["userId", "source"]),
  ai_runs: defineTable({
    userId: v.string(),
    runType: v.string(),
    promptVersion: v.string(),
    schemaVersion: v.string(),
    model: v.string(),
    input: v.optional(v.any()),
    output: v.optional(v.any()),
    status: v.string(),
    startedAt: v.number(),
    finishedAt: v.optional(v.number()),
    tokenUsage: v.optional(v.number()),
    error: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_runType", ["userId", "runType"]),
  prompt_templates: defineTable({
    name: v.string(),
    version: v.string(),
    template: v.string(),
    schemaVersion: v.string(),
    active: v.boolean(),
    updatedAt: v.number(),
  }).index("by_name_and_version", ["name", "version"]),
});
