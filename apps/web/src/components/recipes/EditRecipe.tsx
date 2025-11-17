"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import { Id } from "@packages/backend/convex/_generated/dataModel";
import { X, Plus, Trash2, Save } from "lucide-react";

interface Recipe {
  _id: Id<"recipes">;
  title: string;
  description?: string;
  ingredients: Array<{
    amount?: string;
    unit?: string;
    item: string;
    notes?: string;
  }>;
  instructions: string[];
  servings?: number;
  prepTime?: number;
  cookTime?: number;
  tags?: string[];
}

interface EditRecipeProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe;
}

export default function EditRecipe({ isOpen, onClose, recipe }: EditRecipeProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [servings, setServings] = useState<number | undefined>();
  const [prepTime, setPrepTime] = useState<number | undefined>();
  const [cookTime, setCookTime] = useState<number | undefined>();
  const [ingredients, setIngredients] = useState<
    Array<{ amount?: string; unit?: string; item: string; notes?: string }>
  >([{ item: "" }]);
  const [instructions, setInstructions] = useState<string[]>([""]);
  const [tags, setTags] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const updateRecipe = useMutation(api.recipes.updateRecipe);

  // Pre-populate form when recipe changes
  useEffect(() => {
    if (recipe) {
      setTitle(recipe.title);
      setDescription(recipe.description || "");
      setServings(recipe.servings);
      setPrepTime(recipe.prepTime);
      setCookTime(recipe.cookTime);
      setIngredients(recipe.ingredients.length > 0 ? recipe.ingredients : [{ item: "" }]);
      setInstructions(recipe.instructions.length > 0 ? recipe.instructions : [""]);
      setTags(recipe.tags?.join(", ") || "");
    }
  }, [recipe]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { item: "" }]);
  };

  const handleRemoveIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const handleRemoveInstruction = (index: number) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || ingredients.length === 0 || instructions.length === 0) {
      alert("Please fill in at least the title, ingredients, and instructions.");
      return;
    }

    setIsSaving(true);
    try {
      await updateRecipe({
        id: recipe._id,
        title: title.trim(),
        description: description.trim() || undefined,
        ingredients: ingredients.filter((ing) => ing.item.trim()),
        instructions: instructions.filter((inst) => inst.trim()),
        servings,
        prepTime,
        cookTime,
        tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : undefined,
      });

      onClose();
    } catch (error) {
      console.error("Failed to update recipe:", error);
      alert("Failed to update recipe. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-3xl font-display font-bold text-text-primary">
            Edit Recipe
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-surface transition-colors"
          >
            <X className="w-6 h-6 text-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-display font-bold mb-2 text-text-primary">
                  Recipe Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Grandma's Chocolate Chip Cookies"
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-display font-bold mb-2 text-text-primary">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of your recipe..."
                  className="input w-full min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-display font-bold mb-2 text-text-primary">
                    Servings
                  </label>
                  <input
                    type="number"
                    value={servings || ""}
                    onChange={(e) =>
                      setServings(e.target.value ? parseInt(e.target.value) : undefined)
                    }
                    placeholder="4"
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-display font-bold mb-2 text-text-primary">
                    Prep (min)
                  </label>
                  <input
                    type="number"
                    value={prepTime || ""}
                    onChange={(e) =>
                      setPrepTime(e.target.value ? parseInt(e.target.value) : undefined)
                    }
                    placeholder="15"
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-display font-bold mb-2 text-text-primary">
                    Cook (min)
                  </label>
                  <input
                    type="number"
                    value={cookTime || ""}
                    onChange={(e) =>
                      setCookTime(e.target.value ? parseInt(e.target.value) : undefined)
                    }
                    placeholder="30"
                    className="input w-full"
                  />
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <label className="block text-sm font-display font-bold mb-3 text-text-primary">
                Ingredients *
              </label>
              <div className="space-y-2">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={ingredient.amount || ""}
                      onChange={(e) => {
                        const newIngredients = [...ingredients];
                        newIngredients[index].amount = e.target.value;
                        setIngredients(newIngredients);
                      }}
                      placeholder="Amount"
                      className="input w-24"
                    />
                    <input
                      type="text"
                      value={ingredient.unit || ""}
                      onChange={(e) => {
                        const newIngredients = [...ingredients];
                        newIngredients[index].unit = e.target.value;
                        setIngredients(newIngredients);
                      }}
                      placeholder="Unit"
                      className="input w-24"
                    />
                    <input
                      type="text"
                      value={ingredient.item}
                      onChange={(e) => {
                        const newIngredients = [...ingredients];
                        newIngredients[index].item = e.target.value;
                        setIngredients(newIngredients);
                      }}
                      placeholder="Ingredient"
                      className="input flex-1"
                      required
                    />
                    {ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(index)}
                        className="p-3 rounded-xl hover:bg-surface text-text-secondary transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="btn-ghost mt-3 w-full"
              >
                <Plus className="w-5 h-5 inline mr-2" />
                Add Ingredient
              </button>
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-sm font-display font-bold mb-3 text-text-primary">
                Instructions *
              </label>
              <div className="space-y-2">
                {instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center flex-shrink-0 mt-3 font-display font-bold text-text-primary">
                      {index + 1}
                    </div>
                    <textarea
                      value={instruction}
                      onChange={(e) => {
                        const newInstructions = [...instructions];
                        newInstructions[index] = e.target.value;
                        setInstructions(newInstructions);
                      }}
                      placeholder={`Step ${index + 1}`}
                      className="input flex-1 min-h-[80px]"
                      required
                    />
                    {instructions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveInstruction(index)}
                        className="p-3 rounded-xl hover:bg-surface text-text-secondary transition-colors mt-3"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddInstruction}
                className="btn-ghost mt-3 w-full"
              >
                <Plus className="w-5 h-5 inline mr-2" />
                Add Step
              </button>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-display font-bold mb-2 text-text-primary">
                Tags
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="dinner, italian, pasta (comma-separated)"
                className="input w-full"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary w-full text-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                "Saving..."
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
