import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";

const CollectionDetailScreen = ({ navigation, route }) => {
  const { collectionId, collectionName } = route.params;
  const insets = useSafeAreaInsets();

  // If collectionId is "all", show all recipes, otherwise show collection recipes
  const allRecipes = useQuery(api.recipes.getRecipes);
  const collectionRecipes =
    collectionId !== "all"
      ? useQuery(api.collections.getCollectionRecipes, {
          collectionId,
        })
      : null;

  const recipesToDisplay = collectionId === "all" ? allRecipes : collectionRecipes;

  const renderRecipeCard = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("RecipeDetailsScreen", {
          recipeId: item._id,
        })
      }
      activeOpacity={0.6}
      style={styles.recipeCard}
    >
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.recipeImage} />
      ) : (
        <View style={styles.recipeImagePlaceholder}>
          <Ionicons name="restaurant" size={32} color="#6B6866" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1A1918" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{collectionName}</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.collectionHeader}>
        <Text style={styles.collectionName}>{collectionName}</Text>
        <Text style={styles.collectionCount}>
          {recipesToDisplay?.length || 0} recipe
          {recipesToDisplay?.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {!recipesToDisplay || recipesToDisplay.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyStateImageContainer}>
            <View style={styles.emptyStateCard1} />
            <View style={styles.emptyStateCard2} />
          </View>
          <Text style={styles.emptyStateTitle}>
            No recipes in this{"\n"}collection yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={recipesToDisplay}
          renderItem={renderRecipeCard}
          keyExtractor={(item) => item._id}
          numColumns={2}
          style={styles.recipesList}
          contentContainerStyle={styles.recipesListContent}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.recipeRow}
        />
      )}
    </View>
  );
};

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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: RFValue(18),
    fontFamily: "PPBold",
    color: "#1A1918",
    flex: 1,
    textAlign: "center",
  },
  headerRight: {
    width: 40,
  },
  collectionHeader: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "#F8F4F0",
    marginBottom: 16,
  },
  collectionName: {
    fontSize: RFValue(22),
    fontFamily: "PPBold",
    color: "#1A1918",
    marginBottom: 4,
  },
  collectionCount: {
    fontSize: RFValue(14),
    fontFamily: "PPMedium",
    color: "#6B6866",
  },
  recipesList: {
    flex: 1,
  },
  recipesListContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  recipeRow: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  recipeCard: {
    width: "48%",
    aspectRatio: 0.85,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#F8F4F0",
  },
  recipeImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  recipeImagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F4F0",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyStateImageContainer: {
    width: 160,
    height: 140,
    marginBottom: 32,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateCard1: {
    width: 110,
    height: 130,
    backgroundColor: "#F5F0EB",
    borderRadius: 16,
    position: "absolute",
    transform: [{ rotate: "-12deg" }],
    left: 10,
    top: 5,
  },
  emptyStateCard2: {
    width: 110,
    height: 130,
    backgroundColor: "#E8E3DD",
    borderRadius: 16,
    position: "absolute",
    transform: [{ rotate: "12deg" }],
    right: 10,
    top: 5,
  },
  emptyStateTitle: {
    fontSize: RFValue(26),
    fontFamily: "PPBold",
    color: "#1A1918",
    textAlign: "center",
    lineHeight: RFValue(36),
    letterSpacing: -0.5,
  },
});

export default CollectionDetailScreen;
