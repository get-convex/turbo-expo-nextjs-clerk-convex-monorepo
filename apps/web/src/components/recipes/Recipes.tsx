"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Plus, Search, Clock, Users, Sparkles } from "lucide-react";
import Link from "next/link";
import CreateRecipe from "./CreateRecipe";

export default function Recipes() {
  const { user, isLoaded } = useUser();
  const recipes = useQuery(api.recipes.getRecipes);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (!isLoaded) {
    return (
      <div className="pt-32 pb-20">
        <div className="container">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse text-text-secondary">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-32 pb-20">
        <div className="container max-w-2xl text-center">
          <div className="card p-12">
            <Sparkles className="w-16 h-16 text-accent mx-auto mb-6" />
            <h2 className="text-3xl font-display font-bold mb-4 text-text-primary">
              Sign in to Start Cooking
            </h2>
            <p className="text-lg text-text-secondary mb-8">
              Create your account to save recipes, track variations, and unlock AI-powered features.
            </p>
            <SignInButton mode="modal">
              <button className="btn-primary">Sign In</button>
            </SignInButton>
          </div>
        </div>
      </div>
    );
  }

  const filteredRecipes = recipes?.filter((recipe: any) => {
    const query = searchQuery.toLowerCase();
    return (
      recipe.title.toLowerCase().includes(query) ||
      recipe.description?.toLowerCase().includes(query) ||
      recipe.tags?.some((tag: string) => tag.toLowerCase().includes(query))
    );
  });

  return (
    <>
      <div className="pt-32 pb-20">
        <div className="container">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 text-text-primary">
              My Recipes
            </h1>
            <p className="text-xl text-text-secondary">
              Your personal collection of AI-enhanced recipes
            </p>
          </div>

          {/* Search and Create */}
          <div className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
              <input
                type="text"
                placeholder="Search recipes, ingredients, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input w-full pl-12"
              />
            </div>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="btn-primary flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Create Recipe
            </button>
          </div>

          {/* Recipes Grid */}
          {filteredRecipes === undefined ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-48 bg-surface rounded-2xl mb-4" />
                  <div className="h-6 bg-surface rounded-lg mb-2 w-3/4" />
                  <div className="h-4 bg-surface rounded-lg w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="text-center py-20">
              <div className="card max-w-md mx-auto p-12">
                <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-accent" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-3 text-text-primary">
                  {searchQuery ? "No recipes found" : "No recipes yet"}
                </h3>
                <p className="text-text-secondary mb-6">
                  {searchQuery
                    ? "Try adjusting your search terms"
                    : "Start by creating your first recipe or importing one from the web"}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => setIsCreateOpen(true)}
                    className="btn-primary"
                  >
                    Create Your First Recipe
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe: any, index: number) => (
                <Link
                  key={recipe._id}
                  href={`/recipes/${recipe._id}`}
                  className="group animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="card h-full hover:shadow-lg transition-all">
                    {/* Recipe Image Placeholder */}
                    <div className="relative h-48 bg-gradient-to-br from-surface to-accent/10 rounded-2xl mb-4 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl opacity-20">👨‍🍳</div>
                      </div>
                      {recipe.sourceType && (
                        <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-display font-bold text-accent">
                          {recipe.sourceType}
                        </div>
                      )}
                    </div>

                    {/* Recipe Info */}
                    <div>
                      <h3 className="text-xl font-display font-bold mb-2 text-text-primary group-hover:text-accent transition-colors line-clamp-2">
                        {recipe.title}
                      </h3>
                      {recipe.description && (
                        <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                          {recipe.description}
                        </p>
                      )}

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-sm text-text-secondary">
                        {recipe.prepTime || recipe.cookTime ? (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {(recipe.prepTime || 0) + (recipe.cookTime || 0)} min
                            </span>
                          </div>
                        ) : null}
                        {recipe.servings && (
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{recipe.servings}</span>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {recipe.tags && recipe.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {recipe.tags.slice(0, 3).map((tag: string) => (
                            <span
                              key={tag}
                              className="px-2 py-1 rounded-full bg-surface text-xs text-text-secondary"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Recipe Modal */}
      <CreateRecipe isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </>
  );
}
