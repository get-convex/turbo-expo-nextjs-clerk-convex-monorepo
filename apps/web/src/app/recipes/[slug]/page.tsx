import Header from "@/components/Header";
import RecipeDetails from "@/components/recipes/RecipeDetails";
import { Id } from "@packages/backend/convex/_generated/dataModel";

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <main className="min-h-screen bg-canvas">
      <Header />
      <RecipeDetails recipeId={slug as Id<"recipes">} />
    </main>
  );
}
