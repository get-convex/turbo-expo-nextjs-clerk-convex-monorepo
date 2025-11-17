import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@packages/backend/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";

export default function RecipeDetailsScreen({ route, navigation }) {
  const { recipeId } = route.params;
  const recipe = useQuery(api.recipes.getRecipe, { id: recipeId });
  const variations = useQuery(api.recipes.getRecipeVariations, { recipeId });
  const deleteRecipe = useMutation(api.recipes.deleteRecipe);

  const [expandedSection, setExpandedSection] = useState<"ingredients" | "instructions">("ingredients");

  const handleDelete = async () => {
    Alert.alert(
      "Delete Recipe",
      "Are you sure you want to delete this recipe?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteRecipe({ recipeId });
              navigation.navigate("RecipesDashboardScreen");
            } catch (error) {
              console.error("Failed to delete recipe:", error);
              Alert.alert("Error", "Failed to delete recipe");
            }
          },
        },
      ]
    );
  };

  if (recipe === undefined) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFEFE" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Loading...</Text>
          <View style={styles.headerButton} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F64C20" />
        </View>
      </View>
    );
  }

  if (recipe === null) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFEFE" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Not Found</Text>
          <View style={styles.headerButton} />
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Recipe not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFEFE" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {recipe.title}
        </Text>
        <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
          <Ionicons name="trash-outline" size={22} color="#FFFEFE" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Recipe Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.recipeTitle}>{recipe.title}</Text>
          {recipe.description && (
            <Text style={styles.recipeDescription}>{recipe.description}</Text>
          )}

          {/* Meta Info */}
          <View style={styles.metaContainer}>
            {(recipe.prepTime || recipe.cookTime) && (
              <View style={styles.metaItem}>
                <Ionicons name="time" size={20} color="#F64C20" />
                <View style={styles.metaTextContainer}>
                  <Text style={styles.metaValue}>
                    {(recipe.prepTime || 0) + (recipe.cookTime || 0)} min
                  </Text>
                  <Text style={styles.metaLabel}>Total Time</Text>
                </View>
              </View>
            )}
            {recipe.servings && (
              <View style={styles.metaItem}>
                <Ionicons name="people" size={20} color="#F64C20" />
                <View style={styles.metaTextContainer}>
                  <Text style={styles.metaValue}>{recipe.servings}</Text>
                  <Text style={styles.metaLabel}>Servings</Text>
                </View>
              </View>
            )}
          </View>

          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {recipe.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Section Tabs */}
        <View style={styles.sectionTabs}>
          <TouchableOpacity
            style={[
              styles.sectionTab,
              expandedSection === "ingredients" && styles.sectionTabActive,
            ]}
            onPress={() => setExpandedSection("ingredients")}
          >
            <Text
              style={[
                styles.sectionTabText,
                expandedSection === "ingredients" && styles.sectionTabTextActive,
              ]}
            >
              Ingredients
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sectionTab,
              expandedSection === "instructions" && styles.sectionTabActive,
            ]}
            onPress={() => setExpandedSection("instructions")}
          >
            <Text
              style={[
                styles.sectionTabText,
                expandedSection === "instructions" && styles.sectionTabTextActive,
              ]}
            >
              Instructions
            </Text>
          </TouchableOpacity>
        </View>

        {/* Ingredients Section */}
        {expandedSection === "ingredients" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {recipe.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <View style={styles.ingredientBullet} />
                <Text style={styles.ingredientText}>
                  <Text style={styles.ingredientAmount}>
                    {ingredient.amount} {ingredient.unit}
                  </Text>{" "}
                  {ingredient.item}
                  {ingredient.notes && (
                    <Text style={styles.ingredientNotes}> ({ingredient.notes})</Text>
                  )}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Instructions Section */}
        {expandedSection === "instructions" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            {recipe.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Variations Section */}
        <View style={styles.variationsSection}>
          <Text style={styles.sectionTitle}>Cooking Variations</Text>
          {variations === undefined ? (
            <ActivityIndicator size="small" color="#F64C20" />
          ) : variations.length === 0 ? (
            <View style={styles.emptyVariations}>
              <Ionicons name="calendar-outline" size={48} color="#A8A5A3" />
              <Text style={styles.emptyVariationsText}>
                No variations yet
              </Text>
              <Text style={styles.emptyVariationsSubtext}>
                Create one after cooking this recipe!
              </Text>
            </View>
          ) : (
            variations.map((variation, index) => (
              <View key={variation._id} style={styles.variationCard}>
                <Text style={styles.variationTitle}>{variation.title}</Text>
                <View style={styles.variationMeta}>
                  <Ionicons name="calendar-outline" size={14} color="#6B6866" />
                  <Text style={styles.variationDate}>
                    {new Date(variation.createdAt).toLocaleDateString()}
                  </Text>
                  {variation.rating && (
                    <View style={styles.variationRating}>
                      {[...Array(variation.rating)].map((_, i) => (
                        <Ionicons key={i} name="star" size={14} color="#F64C20" />
                      ))}
                    </View>
                  )}
                </View>
                {variation.notes && (
                  <Text style={styles.variationNotes}>{variation.notes}</Text>
                )}
                <View style={styles.variationModifications}>
                  <Text style={styles.variationModificationsText}>
                    {variation.modifications}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Source */}
        {recipe.source && (
          <View style={styles.sourceContainer}>
            <Text style={styles.sourceLabel}>Original Source</Text>
            <Text style={styles.sourceUrl} numberOfLines={1}>
              {recipe.source}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFEFE",
  },
  header: {
    backgroundColor: "#F64C20",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: RFValue(18),
    fontFamily: "MBold",
    color: "#FFFEFE",
    textAlign: "center",
    marginHorizontal: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: RFValue(16),
    fontFamily: "MRegular",
    color: "#6B6866",
  },
  content: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    margin: 20,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E8E4E0",
  },
  recipeTitle: {
    fontSize: RFValue(24),
    fontFamily: "MBold",
    color: "#1A1918",
    marginBottom: 8,
  },
  recipeDescription: {
    fontSize: RFValue(15),
    fontFamily: "MRegular",
    color: "#6B6866",
    marginBottom: 16,
    lineHeight: 22,
  },
  metaContainer: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaTextContainer: {
    gap: 2,
  },
  metaValue: {
    fontSize: RFValue(15),
    fontFamily: "MBold",
    color: "#1A1918",
  },
  metaLabel: {
    fontSize: RFValue(12),
    fontFamily: "MRegular",
    color: "#6B6866",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#F8F4F0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    fontSize: RFValue(12),
    fontFamily: "MRegular",
    color: "#6B6866",
  },
  sectionTabs: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#F8F4F0",
    borderRadius: 12,
    padding: 4,
  },
  sectionTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  sectionTabActive: {
    backgroundColor: "#FFFFFF",
  },
  sectionTabText: {
    fontSize: RFValue(14),
    fontFamily: "MMedium",
    color: "#6B6866",
  },
  sectionTabTextActive: {
    color: "#F64C20",
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: RFValue(18),
    fontFamily: "MBold",
    color: "#1A1918",
    marginBottom: 16,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 12,
  },
  ingredientBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F64C20",
    marginTop: 6,
  },
  ingredientText: {
    flex: 1,
    fontSize: RFValue(14),
    fontFamily: "MRegular",
    color: "#6B6866",
    lineHeight: 20,
  },
  ingredientAmount: {
    fontFamily: "MMedium",
    color: "#1A1918",
  },
  ingredientNotes: {
    color: "#A8A5A3",
    fontSize: RFValue(13),
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 12,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F64C20",
    justifyContent: "center",
    alignItems: "center",
  },
  instructionNumberText: {
    fontSize: RFValue(13),
    fontFamily: "MBold",
    color: "#FFFEFE",
  },
  instructionText: {
    flex: 1,
    fontSize: RFValue(14),
    fontFamily: "MRegular",
    color: "#6B6866",
    lineHeight: 20,
  },
  variationsSection: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  emptyVariations: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyVariationsText: {
    fontSize: RFValue(15),
    fontFamily: "MBold",
    color: "#1A1918",
    marginTop: 12,
  },
  emptyVariationsSubtext: {
    fontSize: RFValue(13),
    fontFamily: "MRegular",
    color: "#6B6866",
    marginTop: 4,
  },
  variationCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8E4E0",
    marginBottom: 12,
  },
  variationTitle: {
    fontSize: RFValue(16),
    fontFamily: "MBold",
    color: "#1A1918",
    marginBottom: 8,
  },
  variationMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  variationDate: {
    fontSize: RFValue(12),
    fontFamily: "MRegular",
    color: "#6B6866",
  },
  variationRating: {
    flexDirection: "row",
    gap: 2,
    marginLeft: 4,
  },
  variationNotes: {
    fontSize: RFValue(14),
    fontFamily: "MRegular",
    color: "#6B6866",
    marginBottom: 8,
    lineHeight: 20,
  },
  variationModifications: {
    backgroundColor: "rgba(246, 76, 32, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  variationModificationsText: {
    fontSize: RFValue(12),
    fontFamily: "MRegular",
    color: "#F64C20",
  },
  sourceContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#F8F4F0",
    borderRadius: 12,
  },
  sourceLabel: {
    fontSize: RFValue(12),
    fontFamily: "MBold",
    color: "#1A1918",
    marginBottom: 4,
  },
  sourceUrl: {
    fontSize: RFValue(13),
    fontFamily: "MRegular",
    color: "#F64C20",
  },
});
