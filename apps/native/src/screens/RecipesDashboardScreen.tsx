import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { useUser } from "@clerk/clerk-expo";
import { api } from "@packages/backend/convex/_generated/api";
import { useQuery } from "convex/react";

const RecipesDashboardScreen = ({ navigation }) => {
  const user = useUser();
  const imageUrl = user?.user?.imageUrl;
  const firstName = user?.user?.firstName;

  const allRecipes = useQuery(api.recipes.getRecipes);
  const [search, setSearch] = useState("");

  const finalRecipes = search
    ? allRecipes?.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(search.toLowerCase()) ||
          recipe.description?.toLowerCase().includes(search.toLowerCase()) ||
          recipe.tags?.some((tag) =>
            tag.toLowerCase().includes(search.toLowerCase()),
          ),
      )
    : allRecipes;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("RecipeDetailsScreen", {
          recipeId: item._id,
        })
      }
      activeOpacity={0.7}
      style={styles.recipeItem}
    >
      <View style={styles.recipeIconContainer}>
        <Text style={styles.recipeIcon}>👨‍🍳</Text>
      </View>
      <View style={styles.recipeContent}>
        <Text style={styles.recipeTitle} numberOfLines={1}>
          {item.title}
        </Text>
        {item.description && (
          <Text style={styles.recipeDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        <View style={styles.recipeMeta}>
          {(item.prepTime || item.cookTime) && (
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={14} color="#6B6866" />
              <Text style={styles.metaText}>
                {(item.prepTime || 0) + (item.cookTime || 0)} min
              </Text>
            </View>
          )}
          {item.servings && (
            <View style={styles.metaItem}>
              <Ionicons name="people-outline" size={14} color="#6B6866" />
              <Text style={styles.metaText}>{item.servings}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
              <Ionicons name="restaurant" size={24} color="#FFFEFE" />
            </View>
            <Text style={styles.logoText}>RecipeAI</Text>
          </View>
          {imageUrl && (
            <Image style={styles.avatar} source={{ uri: imageUrl }} />
          )}
        </View>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>My Recipes</Text>
        <Text style={styles.subtitle}>Your personal collection</Text>
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#A8A5A3" style={styles.searchIcon} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search recipes, ingredients, or tags..."
          placeholderTextColor="#A8A5A3"
          style={styles.searchInput}
        />
      </View>

      {!finalRecipes || finalRecipes.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>🍳</Text>
          <Text style={styles.emptyStateTitle}>
            {search ? "No recipes found" : "No recipes yet"}
          </Text>
          <Text style={styles.emptyStateText}>
            {search
              ? "Try adjusting your search"
              : "Create your first recipe or\nimport one to get started"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={finalRecipes}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          style={styles.recipesList}
          contentContainerStyle={styles.recipesListContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate("CreateRecipeScreen")}
        style={styles.createButton}
      >
        <Ionicons name="add" size={24} color="#FFFEFE" />
        <Text style={styles.createButtonText}>Create Recipe</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFEFE",
  },
  header: {
    backgroundColor: "#F64C20",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255, 254, 254, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: RFValue(20),
    fontFamily: "MBold",
    color: "#FFFEFE",
    marginLeft: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#FFFEFE",
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: RFValue(28),
    fontFamily: "MBold",
    color: "#1A1918",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: RFValue(14),
    fontFamily: "MRegular",
    color: "#6B6866",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F4F0",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: RFValue(15),
    fontFamily: "MRegular",
    color: "#1A1918",
  },
  recipesList: {
    flex: 1,
  },
  recipesListContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  recipeItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E8E4E0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  recipeIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: "#F8F4F0",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  recipeIcon: {
    fontSize: 32,
  },
  recipeContent: {
    flex: 1,
    justifyContent: "center",
  },
  recipeTitle: {
    fontSize: RFValue(16),
    fontFamily: "MBold",
    color: "#1A1918",
    marginBottom: 4,
  },
  recipeDescription: {
    fontSize: RFValue(13),
    fontFamily: "MRegular",
    color: "#6B6866",
    marginBottom: 8,
    lineHeight: 18,
  },
  recipeMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  metaText: {
    fontSize: RFValue(12),
    fontFamily: "MRegular",
    color: "#6B6866",
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: RFValue(18),
    fontFamily: "MBold",
    color: "#1A1918",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: RFValue(14),
    fontFamily: "MRegular",
    color: "#6B6866",
    textAlign: "center",
    lineHeight: 20,
  },
  createButton: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: "#F64C20",
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    shadowColor: "#F64C20",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  createButtonText: {
    color: "#FFFEFE",
    fontSize: RFValue(16),
    fontFamily: "MBold",
    marginLeft: 8,
  },
});

export default RecipesDashboardScreen;
