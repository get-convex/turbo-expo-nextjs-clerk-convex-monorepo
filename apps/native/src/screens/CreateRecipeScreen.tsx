import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@packages/backend/convex/_generated/api";
import { useMutation, useAction } from "convex/react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { AIExtractionLoader } from "../components/AIExtractionLoader";

interface Ingredient {
  id: string;
  text: string;
  isSection: boolean;
}

interface Step {
  id: string;
  text: string;
  isSection: boolean;
}

export default function CreateRecipeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<"ai" | "manual">("ai");
  const [pastedText, setPastedText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [servings, setServings] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: "1", text: "", isSection: false },
  ]);
  const [steps, setSteps] = useState<Step[]>([
    { id: "1", text: "", isSection: false },
  ]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const extractRecipe = useAction(api.openai.extractRecipe);
  const createRecipe = useMutation(api.recipes.createRecipe);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleExtractFromPaste = async () => {
    if (!pastedText.trim()) {
      Alert.alert("Error", "Please paste some recipe text first");
      return;
    }

    setIsExtracting(true);
    try {
      // Extract recipe using AI
      const extracted = await extractRecipe({ text: pastedText });

      // Validate extraction
      if (!extracted.title || !extracted.ingredients || !extracted.instructions) {
        throw new Error("Failed to extract recipe data");
      }

      // Prepare ingredients for database
      const parsedIngredients = extracted.ingredients.map((ing: any) => ({
        amount: ing.amount || undefined,
        unit: ing.unit || undefined,
        item: ing.item,
        notes: ing.notes || undefined,
      }));

      // Create the recipe directly
      const recipeId = await createRecipe({
        title: extracted.title,
        description: extracted.description || undefined,
        ingredients: parsedIngredients,
        instructions: extracted.instructions,
        servings: extracted.servings || undefined,
        prepTime: extracted.prepTime || undefined,
        cookTime: extracted.cookTime || undefined,
        tags: extracted.tags || undefined,
        sourceType: "ai-extract",
      });

      // Reset the form
      setPastedText("");
      setIsExtracting(false);

      // Navigate to the recipe details screen
      navigation.navigate("RecipeDetailsScreen", {
        recipeId: recipeId,
      });
    } catch (error) {
      console.error("Failed to extract recipe:", error);
      setIsExtracting(false);
      Alert.alert(
        "Extraction Failed",
        "We couldn't extract the recipe from the text. Please try again or use manual entry.",
        [
          {
            text: "Try Manual Entry",
            onPress: () => setActiveTab("manual"),
          },
          {
            text: "OK",
            style: "cancel",
          },
        ]
      );
    }
  };

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: Date.now().toString(), text: "", isSection: false },
    ]);
  };

  const addIngredientSection = () => {
    setIngredients([
      ...ingredients,
      { id: Date.now().toString(), text: "", isSection: true },
    ]);
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter((ing) => ing.id !== id));
  };

  const updateIngredient = (id: string, text: string) => {
    setIngredients(
      ingredients.map((ing) => (ing.id === id ? { ...ing, text } : ing))
    );
  };

  const addStep = () => {
    setSteps([
      ...steps,
      { id: Date.now().toString(), text: "", isSection: false },
    ]);
  };

  const addStepSection = () => {
    setSteps([
      ...steps,
      { id: Date.now().toString(), text: "", isSection: true },
    ]);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter((step) => step.id !== id));
  };

  const updateStep = (id: string, text: string) => {
    setSteps(steps.map((step) => (step.id === id ? { ...step, text } : step)));
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a recipe title");
      return;
    }

    const validIngredients = ingredients.filter((ing) => ing.text.trim());
    const validSteps = steps.filter((step) => step.text.trim());

    if (validIngredients.length === 0 || validSteps.length === 0) {
      Alert.alert("Error", "Please add at least one ingredient and one step");
      return;
    }

    try {
      const parsedIngredients = validIngredients.map((ing) => {
        if (ing.isSection) {
          return { item: ing.text, isSection: true };
        }
        const parts = ing.text.trim().split(" ");
        if (parts.length >= 2) {
          return {
            amount: parts[0],
            unit: parts.length >= 3 ? parts[1] : undefined,
            item: parts.slice(parts.length >= 3 ? 2 : 1).join(" "),
          };
        }
        return { item: ing.text.trim() };
      });

      await createRecipe({
        title: title.trim(),
        ingredients: parsedIngredients,
        instructions: validSteps.map((s) => s.text.trim()),
        servings: servings ? parseInt(servings) : undefined,
        prepTime: prepTime ? parseInt(prepTime) : undefined,
        cookTime: cookTime ? parseInt(cookTime) : undefined,
        tags: tags.length > 0 ? tags : undefined,
        imageUrl: imageUri || undefined,
      });

      Alert.alert("Success", "Recipe created!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("RecipesDashboardScreen"),
        },
      ]);
    } catch (error) {
      console.error("Failed to create recipe:", error);
      Alert.alert("Error", "Failed to create recipe. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1A1918" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add recipe</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Ionicons name="checkmark" size={32} color="#FFFEFE" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "ai" && styles.tabActive]}
          onPress={() => setActiveTab("ai")}
          activeOpacity={0.6}
        >
          <Ionicons
            name="sparkles"
            size={18}
            color={activeTab === "ai" ? "#F64C20" : "#6B6866"}
          />
          <Text
            style={[styles.tabText, activeTab === "ai" && styles.tabTextActive]}
          >
            AI Extract
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "manual" && styles.tabActive]}
          onPress={() => setActiveTab("manual")}
          activeOpacity={0.6}
        >
          <Ionicons
            name="create"
            size={18}
            color={activeTab === "manual" ? "#F64C20" : "#6B6866"}
          />
          <Text
            style={[styles.tabText, activeTab === "manual" && styles.tabTextActive]}
          >
            Manual Entry
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {activeTab === "ai" ? (
          <View style={styles.aiTab}>
            <Text style={styles.description}>
              Paste any recipe text, and AI will extract ingredients and instructions.
            </Text>
            <TextInput
              value={pastedText}
              onChangeText={setPastedText}
              placeholder="Paste your recipe here..."
              placeholderTextColor="#A8A5A3"
              multiline
              style={styles.pasteInput}
            />
            <TouchableOpacity
              onPress={handleExtractFromPaste}
              disabled={isExtracting || !pastedText.trim()}
              style={[
                styles.extractButton,
                (isExtracting || !pastedText.trim()) && styles.extractButtonDisabled,
              ]}
              activeOpacity={0.6}
            >
              {isExtracting ? (
                <ActivityIndicator color="#FFFEFE" />
              ) : (
                <>
                  <Ionicons name="sparkles" size={20} color="#FFFEFE" />
                  <Text style={styles.extractButtonText}>Extract Recipe</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.manualTab}>
            {/* Photo Section */}
            <View style={styles.photoSection}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.recipeImage} />
              ) : (
                <View style={styles.photoPlaceholder} />
              )}
              <TouchableOpacity onPress={pickImage} style={styles.changePhotoButton}>
                <Text style={styles.changePhotoText}>Change photo</Text>
              </TouchableOpacity>
            </View>

            {/* Name */}
            <Text style={styles.sectionLabel}>Name</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Recipe name"
              placeholderTextColor="#A8A5A3"
              style={styles.input}
            />

            {/* Servings, Prep Time, Cook Time */}
            <View style={styles.timingsCard}>
              <View style={styles.timingRow}>
                <Text style={styles.timingLabel}>Servings</Text>
                <TextInput
                  value={servings}
                  onChangeText={setServings}
                  placeholder="0"
                  placeholderTextColor="#A8A5A3"
                  keyboardType="number-pad"
                  style={styles.timingInput}
                />
              </View>

              <View style={styles.timingRow}>
                <Text style={styles.timingLabel}>Prep Time</Text>
                <TextInput
                  value={prepTime}
                  onChangeText={setPrepTime}
                  placeholder="0 min"
                  placeholderTextColor="#A8A5A3"
                  keyboardType="number-pad"
                  style={styles.timingInput}
                />
              </View>

              <View style={styles.timingRow}>
                <Text style={styles.timingLabel}>Cook Time</Text>
                <TextInput
                  value={cookTime}
                  onChangeText={setCookTime}
                  placeholder="0 h"
                  placeholderTextColor="#A8A5A3"
                  keyboardType="number-pad"
                  style={styles.timingInput}
                />
              </View>
            </View>

            {/* Ingredients */}
            <Text style={styles.sectionLabel}>Ingredients</Text>
            <View style={styles.listCard}>
              {ingredients.map((ingredient, index) => (
                <View key={ingredient.id} style={styles.listItem}>
                  <TouchableOpacity
                    onPress={() => removeIngredient(ingredient.id)}
                    style={styles.deleteButton}
                  >
                    <View style={styles.minusIcon} />
                  </TouchableOpacity>

                  <TextInput
                    value={ingredient.text}
                    onChangeText={(text) => updateIngredient(ingredient.id, text)}
                    placeholder={
                      ingredient.isSection
                        ? "Section name"
                        : "e.g., 2 cups flour"
                    }
                    placeholderTextColor="#A8A5A3"
                    style={[
                      styles.listInput,
                      ingredient.isSection && styles.sectionInput,
                    ]}
                  />

                  <TouchableOpacity style={styles.dragHandle}>
                    <Ionicons name="reorder-two" size={20} color="#A8A5A3" />
                  </TouchableOpacity>
                </View>
              ))}

              <View style={styles.addButtonsRow}>
                <TouchableOpacity
                  onPress={addIngredient}
                  style={styles.addButton}
                  activeOpacity={0.6}
                >
                  <Ionicons name="add" size={16} color="#1A1918" />
                  <Text style={styles.addButtonText}>Ingredient</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={addIngredientSection}
                  style={styles.addButton}
                  activeOpacity={0.6}
                >
                  <Ionicons name="add" size={16} color="#1A1918" />
                  <Text style={styles.addButtonText}>Section</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Method */}
            <Text style={styles.sectionLabel}>Method</Text>
            <View style={styles.listCard}>
              {steps.map((step, index) => (
                <View key={step.id} style={styles.listItem}>
                  <TouchableOpacity
                    onPress={() => removeStep(step.id)}
                    style={styles.deleteButton}
                  >
                    <View style={styles.minusIcon} />
                  </TouchableOpacity>

                  <TextInput
                    value={step.text}
                    onChangeText={(text) => updateStep(step.id, text)}
                    placeholder={
                      step.isSection ? "Section name" : "Describe this step"
                    }
                    placeholderTextColor="#A8A5A3"
                    multiline
                    style={[
                      styles.listInput,
                      styles.stepInput,
                      step.isSection && styles.sectionInput,
                    ]}
                  />

                  <TouchableOpacity style={styles.dragHandle}>
                    <Ionicons name="reorder-two" size={20} color="#A8A5A3" />
                  </TouchableOpacity>
                </View>
              ))}

              <View style={styles.addButtonsRow}>
                <TouchableOpacity
                  onPress={addStep}
                  style={styles.addButton}
                  activeOpacity={0.6}
                >
                  <Ionicons name="add" size={16} color="#1A1918" />
                  <Text style={styles.addButtonText}>Step</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={addStepSection}
                  style={styles.addButton}
                  activeOpacity={0.6}
                >
                  <Ionicons name="add" size={16} color="#1A1918" />
                  <Text style={styles.addButtonText}>Section</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Tags */}
            <Text style={styles.sectionLabel}>Tags</Text>
            <View style={styles.tagsCard}>
              {tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {tags.map((tag) => (
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                      <TouchableOpacity onPress={() => removeTag(tag)}>
                        <Ionicons name="close" size={16} color="#6B6866" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              <TouchableOpacity onPress={addTag} style={styles.addTagButton}>
                <Ionicons name="add" size={16} color="#1A1918" />
                <TextInput
                  value={tagInput}
                  onChangeText={setTagInput}
                  onSubmitEditing={addTag}
                  placeholder="Tags"
                  placeholderTextColor="#A8A5A3"
                  style={styles.tagInput}
                />
              </TouchableOpacity>
            </View>

            <View style={{ height: 60 }} />
          </View>
        )}
      </ScrollView>

      {/* AI Extraction Loading Modal */}
      <AIExtractionLoader visible={isExtracting} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFEFE",
  },
  header: {
    backgroundColor: "#FFFEFE",
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E8E4E0",
  },
  headerTitle: {
    fontSize: RFValue(18),
    fontFamily: "PPBold",
    color: "#1A1918",
    flex: 1,
    textAlign: "center",
  },
  saveButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1A1918",
    alignItems: "center",
    justifyContent: "center",
  },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E8E4E0",
    backgroundColor: "#FFFFFF",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#F64C20",
  },
  tabText: {
    fontSize: RFValue(14),
    fontFamily: "PPMedium",
    color: "#6B6866",
  },
  tabTextActive: {
    color: "#F64C20",
    fontFamily: "PPBold",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  aiTab: {
    flex: 1,
  },
  description: {
    fontSize: RFValue(14),
    fontFamily: "PPMedium",
    color: "#6B6866",
    marginBottom: 16,
  },
  pasteInput: {
    backgroundColor: "#FFFEFE",
    borderWidth: 1,
    borderColor: "#E8E4E0",
    borderRadius: 12,
    padding: 16,
    fontSize: RFValue(14),
    fontFamily: "PPMedium",
    color: "#1A1918",
    minHeight: 300,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  extractButton: {
    backgroundColor: "#F64C20",
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  extractButtonDisabled: {
    opacity: 0.5,
  },
  extractButtonText: {
    fontSize: RFValue(15),
    fontFamily: "PPBold",
    color: "#FFFEFE",
  },
  manualTab: {
    flex: 1,
  },
  photoSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  recipeImage: {
    width: 140,
    height: 140,
    borderRadius: 12,
    marginBottom: 16,
  },
  photoPlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 12,
    backgroundColor: "#F8F4F0",
    marginBottom: 16,
  },
  changePhotoButton: {
    backgroundColor: "#F8F4F0",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 100,
  },
  changePhotoText: {
    fontSize: RFValue(14),
    fontFamily: "PPBold",
    color: "#1A1918",
  },
  sectionLabel: {
    fontSize: RFValue(16),
    fontFamily: "PPBold",
    color: "#1A1918",
    marginBottom: 12,
    marginTop: 8,
  },
  input: {
    backgroundColor: "#FFFEFE",
    borderWidth: 1,
    borderColor: "#E8E4E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: RFValue(15),
    fontFamily: "PPMedium",
    color: "#1A1918",
    marginBottom: 16,
  },
  timingsCard: {
    backgroundColor: "#FFFEFE",
    borderWidth: 1,
    borderColor: "#E8E4E0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  timingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  timingLabel: {
    fontSize: RFValue(15),
    fontFamily: "PPMedium",
    color: "#1A1918",
  },
  timingInput: {
    fontSize: RFValue(15),
    fontFamily: "PPBold",
    color: "#F64C20",
    textAlign: "right",
    minWidth: 60,
  },
  listCard: {
    backgroundColor: "#FFFEFE",
    borderWidth: 1,
    borderColor: "#E8E4E0",
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 8,
  },
  deleteButton: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  minusIcon: {
    width: 12,
    height: 2,
    backgroundColor: "#F64C20",
    borderRadius: 1,
  },
  dragHandle: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  listInput: {
    flex: 1,
    fontSize: RFValue(14),
    fontFamily: "PPMedium",
    color: "#1A1918",
    paddingVertical: 0,
  },
  stepInput: {
    minHeight: 40,
  },
  sectionInput: {
    fontFamily: "PPBold",
  },
  addButtonsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  addButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8E4E0",
    borderRadius: 8,
    paddingVertical: 12,
    gap: 6,
  },
  addButtonText: {
    fontSize: RFValue(13),
    fontFamily: "PPBold",
    color: "#1A1918",
  },
  tagsCard: {
    backgroundColor: "#FFFEFE",
    borderWidth: 1,
    borderColor: "#E8E4E0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F4F0",
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  tagText: {
    fontSize: RFValue(13),
    fontFamily: "PPMedium",
    color: "#1A1918",
  },
  addTagButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8E4E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
  },
  tagInput: {
    flex: 1,
    fontSize: RFValue(13),
    fontFamily: "PPMedium",
    color: "#1A1918",
    paddingVertical: 0,
  },
});
