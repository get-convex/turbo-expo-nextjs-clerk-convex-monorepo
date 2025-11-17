"use client";

import { useState } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import { Id } from "@packages/backend/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import {
  Clock,
  Users,
  ArrowLeft,
  Trash2,
  Sparkles,
  Plus,
  Calendar,
  Star,
  Edit,
} from "lucide-react";
import Link from "next/link";
import EditRecipe from "./EditRecipe";

interface RecipeDetailsProps {
  recipeId: Id<"recipes">;
}

export default function RecipeDetails({ recipeId }: RecipeDetailsProps) {
  const router = useRouter();
  const recipe = useQuery(api.recipes.getRecipe, { id: recipeId });
  const variations = useQuery(api.recipes.getRecipeVariations, { recipeId });
  const deleteRecipe = useMutation(api.recipes.deleteRecipe);
  const createVariation = useMutation(api.recipes.createRecipeVariation);
  const modifyRecipe = useAction(api.openai.modifyRecipe);

  const [isCreatingVariation, setIsCreatingVariation] = useState(false);
  const [isEditingRecipe, setIsEditingRecipe] = useState(false);
  const [variationTitle, setVariationTitle] = useState("");
  const [variationNotes, setVariationNotes] = useState("");
  const [modificationRequest, setModificationRequest] = useState("");
  const [isModifying, setIsModifying] = useState(false);
  const [rating, setRating] = useState<number>(0);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this recipe?")) return;

    try {
      await deleteRecipe({ recipeId });
      router.push("/recipes");
    } catch (error) {
      console.error("Failed to delete recipe:", error);
      alert("Failed to delete recipe. Please try again.");
    }
  };

  const handleAIModification = async () => {
    if (!recipe || !modificationRequest.trim()) return;

    setIsModifying(true);
    try {
      const result = await modifyRecipe({
        recipeTitle: recipe.title,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        modificationRequest,
      });

      await createVariation({
        recipeId,
        title: variationTitle.trim() || `Modified: ${modificationRequest.slice(0, 30)}...`,
        notes: variationNotes.trim() || undefined,
        modifications: result.modificationSummary,
        ingredients: result.ingredients,
        instructions: result.instructions,
        rating: rating > 0 ? rating : undefined,
      });

      // Reset form
      setVariationTitle("");
      setVariationNotes("");
      setModificationRequest("");
      setRating(0);
      setIsCreatingVariation(false);
    } catch (error) {
      console.error("Failed to create variation:", error);
      alert("Failed to create variation. Please try again.");
    } finally {
      setIsModifying(false);
    }
  };

  const handleCreateSimpleVariation = async () => {
    if (!variationTitle.trim()) {
      alert("Please provide a title for this variation.");
      return;
    }

    try {
      await createVariation({
        recipeId,
        title: variationTitle.trim(),
        notes: variationNotes.trim() || undefined,
        modifications: "Manual variation",
        rating: rating > 0 ? rating : undefined,
      });

      setVariationTitle("");
      setVariationNotes("");
      setRating(0);
      setIsCreatingVariation(false);
    } catch (error) {
      console.error("Failed to create variation:", error);
      alert("Failed to create variation. Please try again.");
    }
  };

  if (recipe === undefined) {
    return (
      <div className="pt-32 pb-20">
        <div className="container">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-surface rounded-lg w-1/3" />
            <div className="h-64 bg-surface rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (recipe === null) {
    return (
      <div className="pt-32 pb-20">
        <div className="container max-w-2xl text-center">
          <div className="card p-12">
            <h2 className="text-3xl font-display font-bold mb-4 text-text-primary">
              Recipe Not Found
            </h2>
            <p className="text-lg text-text-secondary mb-8">
              This recipe doesn't exist or has been deleted.
            </p>
            <Link href="/recipes">
              <button className="btn-primary">Back to Recipes</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20">
      <div className="container max-w-6xl">
        {/* Back Button */}
        <Link
          href="/recipes"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Recipes
        </Link>

        {/* Recipe Header */}
        <div className="card p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-text-primary">
                {recipe.title}
              </h1>
              {recipe.description && (
                <p className="text-xl text-text-secondary mb-6">{recipe.description}</p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-text-secondary">
                {recipe.prepTime || recipe.cookTime ? (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <div>
                      <div className="font-display font-bold text-text-primary">
                        {(recipe.prepTime || 0) + (recipe.cookTime || 0)} min
                      </div>
                      <div className="text-sm">
                        {recipe.prepTime ? `${recipe.prepTime}m prep` : ""}
                        {recipe.prepTime && recipe.cookTime ? " + " : ""}
                        {recipe.cookTime ? `${recipe.cookTime}m cook` : ""}
                      </div>
                    </div>
                  </div>
                ) : null}
                {recipe.servings && (
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <div>
                      <div className="font-display font-bold text-text-primary">
                        {recipe.servings}
                      </div>
                      <div className="text-sm">Servings</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Tags */}
              {recipe.tags && recipe.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {recipe.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-full bg-surface text-sm text-text-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditingRecipe(true)}
                className="p-3 rounded-xl hover:bg-surface text-text-secondary hover:text-accent transition-colors"
                title="Edit Recipe"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-3 rounded-xl hover:bg-surface text-text-secondary hover:text-accent transition-colors"
                title="Delete Recipe"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {recipe.source && (
            <div className="pt-6 border-t border-border">
              <a
                href={recipe.source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent hover:underline"
              >
                Original Source →
              </a>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Ingredients */}
          <div className="card p-8">
            <h2 className="text-2xl font-display font-bold mb-6 text-text-primary">
              Ingredients
            </h2>
            <div className="space-y-3">
              {recipe.ingredients.map((ingredient, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-2" />
                  <div className="flex-1">
                    <span className="font-medium text-text-primary">
                      {ingredient.amount} {ingredient.unit}
                    </span>{" "}
                    <span className="text-text-secondary">{ingredient.item}</span>
                    {ingredient.notes && (
                      <div className="text-sm text-text-tertiary mt-1">
                        {ingredient.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="card p-8">
            <h2 className="text-2xl font-display font-bold mb-6 text-text-primary">
              Instructions
            </h2>
            <div className="space-y-4">
              {recipe.instructions.map((instruction, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-display font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-text-secondary pt-1 flex-1">{instruction}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Variations Section */}
        <div className="card p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-display font-bold text-text-primary mb-2">
                Cooking Variations
              </h2>
              <p className="text-text-secondary">
                Track different versions and modifications
              </p>
            </div>
            <button
              onClick={() => setIsCreatingVariation(!isCreatingVariation)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Variation
            </button>
          </div>

          {/* Create Variation Form */}
          {isCreatingVariation && (
            <div className="mb-8 p-6 rounded-2xl bg-surface space-y-4">
              <div>
                <label className="block text-sm font-display font-bold mb-2 text-text-primary">
                  Variation Title *
                </label>
                <input
                  type="text"
                  value={variationTitle}
                  onChange={(e) => setVariationTitle(e.target.value)}
                  placeholder="e.g., Christmas Dinner 2024, Extra Spicy Version"
                  className="input w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-display font-bold mb-2 text-text-primary">
                  Cooking Notes
                </label>
                <textarea
                  value={variationNotes}
                  onChange={(e) => setVariationNotes(e.target.value)}
                  placeholder="How did it go? What worked well?"
                  className="input w-full min-h-[100px]"
                />
              </div>

              <div>
                <label className="block text-sm font-display font-bold mb-2 text-text-primary">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="transition-colors"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating
                            ? "fill-accent text-accent"
                            : "text-text-tertiary"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <label className="block text-sm font-display font-bold mb-2 text-text-primary">
                  AI Modification (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={modificationRequest}
                    onChange={(e) => setModificationRequest(e.target.value)}
                    placeholder="e.g., Make it spicier, Add more garlic, Make it vegan"
                    className="input flex-1"
                  />
                  <button
                    onClick={handleAIModification}
                    disabled={isModifying || !modificationRequest.trim()}
                    className="btn-primary whitespace-nowrap disabled:opacity-50"
                  >
                    {isModifying ? (
                      "Modifying..."
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 inline mr-2" />
                        AI Modify
                      </>
                    )}
                  </button>
                </div>
                <p className="text-sm text-text-tertiary mt-2">
                  Or save without AI modification
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={handleCreateSimpleVariation} className="btn-primary flex-1">
                  Save Variation
                </button>
                <button
                  onClick={() => {
                    setIsCreatingVariation(false);
                    setVariationTitle("");
                    setVariationNotes("");
                    setModificationRequest("");
                    setRating(0);
                  }}
                  className="btn-ghost flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Variations List */}
          {variations === undefined ? (
            <div className="animate-pulse space-y-4">
              <div className="h-24 bg-surface rounded-2xl" />
              <div className="h-24 bg-surface rounded-2xl" />
            </div>
          ) : variations.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
              <p className="text-text-secondary">
                No variations yet. Create one after cooking this recipe!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {variations.map((variation, index) => (
                <div
                  key={variation._id}
                  className="p-6 rounded-2xl border border-border hover:border-accent transition-colors"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-lg text-text-primary mb-1">
                        {variation.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-text-secondary">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(variation.createdAt).toLocaleDateString()}
                        </span>
                        {variation.rating && (
                          <span className="flex items-center gap-1">
                            {[...Array(variation.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                            ))}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {variation.notes && (
                    <p className="text-text-secondary mb-3">{variation.notes}</p>
                  )}

                  <div className="inline-flex px-3 py-1 rounded-full bg-accent/10 text-accent text-sm">
                    {variation.modifications}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Recipe Modal */}
      {recipe && (
        <EditRecipe
          isOpen={isEditingRecipe}
          onClose={() => setIsEditingRecipe(false)}
          recipe={recipe}
        />
      )}
    </div>
  );
}
