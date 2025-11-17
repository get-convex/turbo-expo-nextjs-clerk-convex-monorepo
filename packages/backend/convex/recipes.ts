import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Auth } from "convex/server";

export const getUserId = async (ctx: { auth: Auth }) => {
  return (await ctx.auth.getUserIdentity())?.subject;
};

const ingredientValidator = v.object({
  amount: v.optional(v.string()),
  unit: v.optional(v.string()),
  item: v.string(),
  notes: v.optional(v.string()),
});

// Get all recipes for a specific user
export const getRecipes = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return null;

    const recipes = await ctx.db
      .query("recipes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    return recipes;
  },
});

// Get a specific recipe
export const getRecipe = query({
  args: {
    id: v.optional(v.id("recipes")),
  },
  handler: async (ctx, args) => {
    const { id } = args;
    if (!id) return null;
    const recipe = await ctx.db.get(id);
    return recipe;
  },
});

// Create a new recipe
export const createRecipe = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    ingredients: v.array(ingredientValidator),
    instructions: v.array(v.string()),
    servings: v.optional(v.number()),
    prepTime: v.optional(v.number()),
    cookTime: v.optional(v.number()),
    imageUrl: v.optional(v.string()),
    source: v.optional(v.string()),
    sourceType: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("User not found");

    const now = Date.now();
    const recipeId = await ctx.db.insert("recipes", {
      userId,
      title: args.title,
      description: args.description,
      ingredients: args.ingredients,
      instructions: args.instructions,
      servings: args.servings,
      prepTime: args.prepTime,
      cookTime: args.cookTime,
      imageUrl: args.imageUrl,
      source: args.source,
      sourceType: args.sourceType,
      tags: args.tags,
      createdAt: now,
      updatedAt: now,
    });

    return recipeId;
  },
});

// Update an existing recipe
export const updateRecipe = mutation({
  args: {
    id: v.id("recipes"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    ingredients: v.optional(v.array(ingredientValidator)),
    instructions: v.optional(v.array(v.string())),
    servings: v.optional(v.number()),
    prepTime: v.optional(v.number()),
    cookTime: v.optional(v.number()),
    imageUrl: v.optional(v.string()),
    source: v.optional(v.string()),
    sourceType: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, { id, ...updates }) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("User not found");

    const recipe = await ctx.db.get(id);
    if (!recipe) throw new Error("Recipe not found");
    if (recipe.userId !== userId)
      throw new Error("Not authorized to update this recipe");

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return id;
  },
});

// Delete a recipe
export const deleteRecipe = mutation({
  args: {
    recipeId: v.id("recipes"),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("User not found");

    const recipe = await ctx.db.get(args.recipeId);
    if (!recipe) throw new Error("Recipe not found");
    if (recipe.userId !== userId)
      throw new Error("Not authorized to delete this recipe");

    // Delete all variations for this recipe
    const variations = await ctx.db
      .query("recipeVariations")
      .withIndex("by_recipe", (q) => q.eq("recipeId", args.recipeId))
      .collect();

    for (const variation of variations) {
      await ctx.db.delete(variation._id);
    }

    // Delete the recipe
    await ctx.db.delete(args.recipeId);
  },
});

// Get all variations for a recipe
export const getRecipeVariations = query({
  args: {
    recipeId: v.id("recipes"),
  },
  handler: async (ctx, { recipeId }) => {
    const variations = await ctx.db
      .query("recipeVariations")
      .withIndex("by_recipe", (q) => q.eq("recipeId", recipeId))
      .order("desc")
      .collect();

    return variations;
  },
});

// Create a variation/cooking session
export const createRecipeVariation = mutation({
  args: {
    recipeId: v.id("recipes"),
    title: v.string(),
    notes: v.optional(v.string()),
    modifications: v.string(),
    ingredients: v.optional(v.array(ingredientValidator)),
    instructions: v.optional(v.array(v.string())),
    rating: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("User not found");

    const recipe = await ctx.db.get(args.recipeId);
    if (!recipe) throw new Error("Recipe not found");
    if (recipe.userId !== userId)
      throw new Error("Not authorized to create variation for this recipe");

    const variationId = await ctx.db.insert("recipeVariations", {
      recipeId: args.recipeId,
      userId,
      title: args.title,
      notes: args.notes,
      modifications: args.modifications,
      ingredients: args.ingredients,
      instructions: args.instructions,
      rating: args.rating,
      createdAt: Date.now(),
    });

    return variationId;
  },
});

// Delete a variation
export const deleteRecipeVariation = mutation({
  args: {
    variationId: v.id("recipeVariations"),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("User not found");

    const variation = await ctx.db.get(args.variationId);
    if (!variation) throw new Error("Variation not found");
    if (variation.userId !== userId)
      throw new Error("Not authorized to delete this variation");

    await ctx.db.delete(args.variationId);
  },
});
