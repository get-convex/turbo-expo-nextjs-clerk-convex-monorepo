"use client";

import { useState } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import { X, Sparkles, Plus, Trash2, Link as LinkIcon } from "lucide-react";

interface CreateRecipeProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = "paste" | "manual" | "import";

export default function CreateRecipe({ isOpen, onClose }: CreateRecipeProps) {
  const [activeTab, setActiveTab] = useState<Tab>("paste");
  const [pastedText, setPastedText] = useState("");
  const [url, setUrl] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);

  // Manual form state
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

  const extractRecipe = useAction(api.openai.extractRecipe);
  const createRecipe = useMutation(api.recipes.createRecipe);

  const handleExtractFromPaste = async () => {
    if (!pastedText.trim()) return;

    setIsExtracting(true);
    try {
      const extracted = await extractRecipe({ text: pastedText });

      setTitle(extracted.title || "");
      setDescription(extracted.description || "");
      setServings(extracted.servings || undefined);
      setPrepTime(extracted.prepTime || undefined);
      setCookTime(extracted.cookTime || undefined);
      setIngredients(extracted.ingredients || [{ item: "" }]);
      setInstructions(extracted.instructions || [""]);
      setTags(extracted.tags?.join(", ") || "");

      setActiveTab("manual");
    } catch (error) {
      console.error("Failed to extract recipe:", error);
      alert("Failed to extract recipe. Please try again or enter manually.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleImportFromUrl = () => {
    // Placeholder for URL import - backend to be built later
    alert("URL import feature coming soon! For now, try copy-pasting the recipe text.");
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { item: "" }]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const handleRemoveInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || ingredients.length === 0 || instructions.length === 0) {
      alert("Please fill in at least the title, ingredients, and instructions.");
      return;
    }

    try {
      await createRecipe({
        title: title.trim(),
        description: description.trim() || undefined,
        ingredients: ingredients.filter((ing) => ing.item.trim()),
        instructions: instructions.filter((inst) => inst.trim()),
        servings,
        prepTime,
        cookTime,
        tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : undefined,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setServings(undefined);
      setPrepTime(undefined);
      setCookTime(undefined);
      setIngredients([{ item: "" }]);
      setInstructions([""]);
      setTags("");
      setPastedText("");
      setUrl("");
      setActiveTab("paste");

      onClose();
    } catch (error) {
      console.error("Failed to create recipe:", error);
      alert("Failed to create recipe. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-3xl font-display font-bold text-text-primary">
            Create Recipe
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-surface transition-colors"
          >
            <X className="w-6 h-6 text-text-secondary" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab("paste")}
            className={`flex-1 px-6 py-4 font-display font-bold transition-colors ${
              activeTab === "paste"
                ? "text-accent border-b-2 border-accent"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Sparkles className="w-5 h-5 inline mr-2" />
            AI Extract
          </button>
          <button
            onClick={() => setActiveTab("import")}
            className={`flex-1 px-6 py-4 font-display font-bold transition-colors ${
              activeTab === "import"
                ? "text-accent border-b-2 border-accent"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <LinkIcon className="w-5 h-5 inline mr-2" />
            Import URL
          </button>
          <button
            onClick={() => setActiveTab("manual")}
            className={`flex-1 px-6 py-4 font-display font-bold transition-colors ${
              activeTab === "manual"
                ? "text-accent border-b-2 border-accent"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Manual Entry
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {activeTab === "paste" && (
            <div className="space-y-4">
              <p className="text-text-secondary">
                Paste any recipe text, and AI will extract the ingredients and instructions for you.
              </p>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste your recipe here..."
                className="input w-full min-h-[300px] font-mono text-sm"
              />
              <button
                onClick={handleExtractFromPaste}
                disabled={isExtracting || !pastedText.trim()}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExtracting ? (
                  <>Extracting with AI...</>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 inline mr-2" />
                    Extract Recipe
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === "import" && (
            <div className="space-y-4">
              <p className="text-text-secondary">
                Import recipes from YouTube, Instagram, or any recipe website.
              </p>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... or recipe URL"
                className="input w-full"
              />
              <button
                onClick={handleImportFromUrl}
                disabled={!url.trim()}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LinkIcon className="w-5 h-5 inline mr-2" />
                Import from URL
              </button>
              <div className="p-4 rounded-2xl bg-surface text-sm text-text-secondary">
                <strong>Coming soon:</strong> Direct import from YouTube, Instagram, and popular recipe sites!
              </div>
            </div>
          )}

          {activeTab === "manual" && (
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
              <button type="submit" className="btn-primary w-full text-lg">
                Create Recipe
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
