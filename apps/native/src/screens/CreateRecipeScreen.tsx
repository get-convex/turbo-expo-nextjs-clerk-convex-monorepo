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
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@packages/backend/convex/_generated/api";
import { useMutation, useAction } from "convex/react";

export default function CreateRecipeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState<"paste" | "manual">("paste");
  const [pastedText, setPastedText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);

  // Manual form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [servings, setServings] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [ingredientsText, setIngredientsText] = useState("");
  const [instructionsText, setInstructionsText] = useState("");
  const [tags, setTags] = useState("");

  const extractRecipe = useAction(api.openai.extractRecipe);
  const createRecipe = useMutation(api.recipes.createRecipe);

  const handleExtractFromPaste = async () => {
    if (!pastedText.trim()) {
      Alert.alert("Error", "Please paste some recipe text first");
      return;
    }

    setIsExtracting(true);
    try {
      const extracted = await extractRecipe({ text: pastedText });

      // Pre-populate manual form with extracted data
      setTitle(extracted.title || "");
      setDescription(extracted.description || "");
      setServings(extracted.servings?.toString() || "");
      setPrepTime(extracted.prepTime?.toString() || "");
      setCookTime(extracted.cookTime?.toString() || "");

      // Convert ingredients array to text
      const ingredientsText = extracted.ingredients
        ?.map((ing: any) =>
          `${ing.amount || ""} ${ing.unit || ""} ${ing.item}`.trim()
        )
        .join("\n") || "";
      setIngredientsText(ingredientsText);

      // Convert instructions array to text
      setInstructionsText(extracted.instructions?.join("\n\n") || "");
      setTags(extracted.tags?.join(", ") || "");

      // Switch to manual tab to review
      setActiveTab("manual");
      Alert.alert("Success", "Recipe extracted! Review and save below.");
    } catch (error) {
      console.error("Failed to extract recipe:", error);
      Alert.alert("Error", "Failed to extract recipe. Please try manual entry.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleCreateRecipe = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a recipe title");
      return;
    }

    if (!ingredientsText.trim() || !instructionsText.trim()) {
      Alert.alert("Error", "Please enter ingredients and instructions");
      return;
    }

    try {
      // Parse ingredients from text (one per line)
      const ingredients = ingredientsText
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => {
          // Simple parsing: "amount unit item"
          const parts = line.trim().split(" ");
          if (parts.length >= 2) {
            return {
              amount: parts[0],
              unit: parts.length >= 3 ? parts[1] : undefined,
              item: parts.slice(parts.length >= 3 ? 2 : 1).join(" "),
            };
          }
          return { item: line.trim() };
        });

      // Parse instructions from text (split by double newline or single if needed)
      const instructions = instructionsText
        .split(/\n\n|\n/)
        .filter((step) => step.trim())
        .map((step) => step.trim());

      await createRecipe({
        title: title.trim(),
        description: description.trim() || undefined,
        ingredients,
        instructions,
        servings: servings ? parseInt(servings) : undefined,
        prepTime: prepTime ? parseInt(prepTime) : undefined,
        cookTime: cookTime ? parseInt(cookTime) : undefined,
        tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : undefined,
      });

      Alert.alert("Success", "Recipe created!", [
        { text: "OK", onPress: () => navigation.navigate("RecipesDashboardScreen") },
      ]);
    } catch (error) {
      console.error("Failed to create recipe:", error);
      Alert.alert("Error", "Failed to create recipe. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFEFE" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Recipe</Text>
        <View style={styles.headerButton} />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "paste" && styles.tabActive]}
          onPress={() => setActiveTab("paste")}
        >
          <Ionicons
            name="sparkles"
            size={18}
            color={activeTab === "paste" ? "#F64C20" : "#6B6866"}
          />
          <Text
            style={[styles.tabText, activeTab === "paste" && styles.tabTextActive]}
          >
            AI Extract
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "manual" && styles.tabActive]}
          onPress={() => setActiveTab("manual")}
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
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "paste" ? (
          <View style={styles.pasteTab}>
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
            <Text style={styles.label}>Recipe Title *</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g., Grandma's Chocolate Chip Cookies"
              placeholderTextColor="#A8A5A3"
              style={styles.input}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Brief description..."
              placeholderTextColor="#A8A5A3"
              multiline
              style={[styles.input, styles.inputMultiline]}
            />

            <View style={styles.row}>
              <View style={styles.rowItem}>
                <Text style={styles.label}>Servings</Text>
                <TextInput
                  value={servings}
                  onChangeText={setServings}
                  placeholder="4"
                  placeholderTextColor="#A8A5A3"
                  keyboardType="number-pad"
                  style={styles.input}
                />
              </View>
              <View style={styles.rowItem}>
                <Text style={styles.label}>Prep (min)</Text>
                <TextInput
                  value={prepTime}
                  onChangeText={setPrepTime}
                  placeholder="15"
                  placeholderTextColor="#A8A5A3"
                  keyboardType="number-pad"
                  style={styles.input}
                />
              </View>
              <View style={styles.rowItem}>
                <Text style={styles.label}>Cook (min)</Text>
                <TextInput
                  value={cookTime}
                  onChangeText={setCookTime}
                  placeholder="30"
                  placeholderTextColor="#A8A5A3"
                  keyboardType="number-pad"
                  style={styles.input}
                />
              </View>
            </View>

            <Text style={styles.label}>Ingredients * (one per line)</Text>
            <TextInput
              value={ingredientsText}
              onChangeText={setIngredientsText}
              placeholder={"1 cup flour\n2 eggs\n1 tsp salt"}
              placeholderTextColor="#A8A5A3"
              multiline
              style={[styles.input, styles.inputMultiline, { height: 150 }]}
            />

            <Text style={styles.label}>Instructions * (one step per line)</Text>
            <TextInput
              value={instructionsText}
              onChangeText={setInstructionsText}
              placeholder={"Mix dry ingredients\n\nAdd wet ingredients\n\nBake at 350°F"}
              placeholderTextColor="#A8A5A3"
              multiline
              style={[styles.input, styles.inputMultiline, { height: 180 }]}
            />

            <Text style={styles.label}>Tags (comma-separated)</Text>
            <TextInput
              value={tags}
              onChangeText={setTags}
              placeholder="dinner, italian, pasta"
              placeholderTextColor="#A8A5A3"
              style={styles.input}
            />

            <TouchableOpacity
              onPress={handleCreateRecipe}
              style={styles.createButton}
            >
              <Ionicons name="checkmark" size={20} color="#FFFEFE" />
              <Text style={styles.createButtonText}>Create Recipe</Text>
            </TouchableOpacity>
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
    fontSize: RFValue(18),
    fontFamily: "MBold",
    color: "#FFFEFE",
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
    fontFamily: "MMedium",
    color: "#6B6866",
  },
  tabTextActive: {
    color: "#F64C20",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  pasteTab: {
    flex: 1,
  },
  manualTab: {
    flex: 1,
  },
  description: {
    fontSize: RFValue(14),
    fontFamily: "MRegular",
    color: "#6B6866",
    marginBottom: 16,
  },
  pasteInput: {
    backgroundColor: "#F8F4F0",
    borderRadius: 16,
    padding: 16,
    fontSize: RFValue(14),
    fontFamily: "MRegular",
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
    fontFamily: "MBold",
    color: "#FFFEFE",
  },
  label: {
    fontSize: RFValue(13),
    fontFamily: "MBold",
    color: "#1A1918",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#F8F4F0",
    borderRadius: 16,
    padding: 12,
    fontSize: RFValue(14),
    fontFamily: "MRegular",
    color: "#1A1918",
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  rowItem: {
    flex: 1,
  },
  createButton: {
    backgroundColor: "#F64C20",
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
    marginTop: 24,
  },
  createButtonText: {
    fontSize: RFValue(16),
    fontFamily: "MBold",
    color: "#FFFEFE",
  },
});
