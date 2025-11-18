import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  recipes: defineTable({
    userId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    ingredients: v.array(
      v.object({
        amount: v.optional(v.string()),
        unit: v.optional(v.string()),
        item: v.string(),
        notes: v.optional(v.string()),
      })
    ),
    instructions: v.array(v.string()),
    servings: v.optional(v.number()),
    prepTime: v.optional(v.number()), // in minutes
    cookTime: v.optional(v.number()), // in minutes
    imageUrl: v.optional(v.string()),
    source: v.optional(v.string()), // URL where it was imported from
    sourceType: v.optional(v.string()), // "youtube", "instagram", "website", "manual"
    tags: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  recipeVariations: defineTable({
    recipeId: v.id("recipes"),
    userId: v.string(),
    title: v.string(), // e.g., "Spicier version", "Dinner party 2024-03-15"
    notes: v.optional(v.string()), // cooking notes from this session
    modifications: v.string(), // what was changed
    ingredients: v.optional(
      v.array(
        v.object({
          amount: v.optional(v.string()),
          unit: v.optional(v.string()),
          item: v.string(),
          notes: v.optional(v.string()),
        })
      )
    ),
    instructions: v.optional(v.array(v.string())),
    rating: v.optional(v.number()), // 1-5 stars
    createdAt: v.number(), // when they cooked this version
  })
    .index("by_recipe", ["recipeId"])
    .index("by_user", ["userId"]),

  collections: defineTable({
    userId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    icon: v.optional(v.string()), // emoji or icon name
    color: v.optional(v.string()), // color hex for UI
    isDefault: v.optional(v.boolean()), // for system collections like "Favorites"
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  collectionRecipes: defineTable({
    collectionId: v.id("collections"),
    recipeId: v.id("recipes"),
    userId: v.string(),
    addedAt: v.number(),
  })
    .index("by_collection", ["collectionId"])
    .index("by_recipe", ["recipeId"])
    .index("by_user", ["userId"])
    .index("by_collection_and_recipe", ["collectionId", "recipeId"]),
});
