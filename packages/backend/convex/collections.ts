import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserId } from "./recipes";

// Get all collections for a user
export const getCollections = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return null;

    const collections = await ctx.db
      .query("collections")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    return collections;
  },
});

// Get a specific collection
export const getCollection = query({
  args: {
    id: v.id("collections"),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) return null;

    const collection = await ctx.db.get(args.id);

    // Verify user owns this collection
    if (collection?.userId !== userId) return null;

    return collection;
  },
});

// Get recipes in a collection
export const getCollectionRecipes = query({
  args: {
    collectionId: v.id("collections"),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) return null;

    // Get collection recipe links
    const collectionRecipeLinks = await ctx.db
      .query("collectionRecipes")
      .withIndex("by_collection", (q) => q.eq("collectionId", args.collectionId))
      .collect();

    // Get all recipes in this collection
    const recipes = await Promise.all(
      collectionRecipeLinks.map(async (link) => {
        const recipe = await ctx.db.get(link.recipeId);
        return recipe;
      })
    );

    // Filter out any null values and ensure user owns these recipes
    return recipes.filter((recipe) => recipe && recipe.userId === userId);
  },
});

// Get collections that contain a specific recipe
export const getRecipeCollections = query({
  args: {
    recipeId: v.id("recipes"),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) return null;

    // Get collection links for this recipe
    const collectionLinks = await ctx.db
      .query("collectionRecipes")
      .withIndex("by_recipe", (q) => q.eq("recipeId", args.recipeId))
      .collect();

    // Get all collections
    const collections = await Promise.all(
      collectionLinks.map(async (link) => {
        const collection = await ctx.db.get(link.collectionId);
        return collection;
      })
    );

    // Filter out any null values and ensure user owns these collections
    return collections.filter(
      (collection) => collection && collection.userId === userId
    );
  },
});

// Create a new collection
export const createCollection = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
    isDefault: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const now = Date.now();

    const collectionId = await ctx.db.insert("collections", {
      userId,
      name: args.name,
      description: args.description,
      icon: args.icon,
      color: args.color,
      isDefault: args.isDefault,
      createdAt: now,
      updatedAt: now,
    });

    return collectionId;
  },
});

// Update a collection
export const updateCollection = mutation({
  args: {
    id: v.id("collections"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const collection = await ctx.db.get(args.id);
    if (!collection) throw new Error("Collection not found");
    if (collection.userId !== userId) throw new Error("Not authorized");

    const updates: any = {
      updatedAt: Date.now(),
    };

    if (args.name !== undefined) updates.name = args.name;
    if (args.description !== undefined) updates.description = args.description;
    if (args.icon !== undefined) updates.icon = args.icon;
    if (args.color !== undefined) updates.color = args.color;

    await ctx.db.patch(args.id, updates);
  },
});

// Delete a collection
export const deleteCollection = mutation({
  args: {
    id: v.id("collections"),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const collection = await ctx.db.get(args.id);
    if (!collection) throw new Error("Collection not found");
    if (collection.userId !== userId) throw new Error("Not authorized");

    // Delete all recipe links in this collection
    const collectionRecipeLinks = await ctx.db
      .query("collectionRecipes")
      .withIndex("by_collection", (q) => q.eq("collectionId", args.id))
      .collect();

    for (const link of collectionRecipeLinks) {
      await ctx.db.delete(link._id);
    }

    // Delete the collection
    await ctx.db.delete(args.id);
  },
});

// Add a recipe to a collection
export const addRecipeToCollection = mutation({
  args: {
    recipeId: v.id("recipes"),
    collectionId: v.id("collections"),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify user owns both the recipe and collection
    const recipe = await ctx.db.get(args.recipeId);
    const collection = await ctx.db.get(args.collectionId);

    if (!recipe || recipe.userId !== userId) {
      throw new Error("Recipe not found or not authorized");
    }
    if (!collection || collection.userId !== userId) {
      throw new Error("Collection not found or not authorized");
    }

    // Check if already in collection
    const existing = await ctx.db
      .query("collectionRecipes")
      .withIndex("by_collection_and_recipe", (q) =>
        q.eq("collectionId", args.collectionId).eq("recipeId", args.recipeId)
      )
      .first();

    if (existing) {
      return existing._id; // Already added
    }

    // Add to collection
    const linkId = await ctx.db.insert("collectionRecipes", {
      collectionId: args.collectionId,
      recipeId: args.recipeId,
      userId,
      addedAt: Date.now(),
    });

    return linkId;
  },
});

// Remove a recipe from a collection
export const removeRecipeFromCollection = mutation({
  args: {
    recipeId: v.id("recipes"),
    collectionId: v.id("collections"),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Find the link
    const link = await ctx.db
      .query("collectionRecipes")
      .withIndex("by_collection_and_recipe", (q) =>
        q.eq("collectionId", args.collectionId).eq("recipeId", args.recipeId)
      )
      .first();

    if (!link) return; // Already removed

    // Verify user owns this link
    if (link.userId !== userId) throw new Error("Not authorized");

    await ctx.db.delete(link._id);
  },
});
