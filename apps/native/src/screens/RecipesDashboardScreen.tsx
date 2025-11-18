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
  Platform,
  ScrollView,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { useUser } from "@clerk/clerk-expo";
import { api } from "@packages/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AddNewModal from "../components/AddNewModal";

const RecipesDashboardScreen = ({ navigation }) => {
  const user = useUser();
  const imageUrl = user?.user?.imageUrl;
  const firstName = user?.user?.firstName;
  const insets = useSafeAreaInsets();

  const allRecipes = useQuery(api.recipes.getRecipes);
  const collections = useQuery(api.collections.getCollections);
  const [showAddModal, setShowAddModal] = useState(false);

  // Create "All recipes" as the default collection
  const allRecipesCollection = {
    _id: "all",
    name: "All recipes",
    color: "#F64C20",
    icon: "restaurant",
    recipeCount: allRecipes?.length || 0,
    previewRecipes: allRecipes?.slice(0, 3) || [],
  };

  // For now, just show all collections without recipe data
  // We'll need to fetch recipe counts separately or update the backend query
  const collectionsWithData = collections?.map((collection) => {
    return {
      ...collection,
      recipeCount: 0, // TODO: Fetch actual count from collectionRecipes
      previewRecipes: [],
    };
  }) || [];

  // Combine all collections with "All recipes" at the top
  const allCollections = [allRecipesCollection, ...collectionsWithData];

  const renderCollectionCard = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("CollectionDetailScreen", {
          collectionId: item._id,
          collectionName: item.name,
        })
      }
      activeOpacity={0.6}
      style={styles.collectionCard}
    >
      <View style={styles.collectionInfo}>
        <Text style={styles.collectionName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.recipeCount}>
          {item.recipeCount} recipe{item.recipeCount !== 1 ? 's' : ''}
        </Text>
      </View>

      {item.previewRecipes.length > 0 && (
        <View style={styles.previewImagesContainer}>
          {item.previewRecipes.map((recipe: any, index: number) => {
            // Fanned stack from bottom-right corner
            // Image[0] (back-left, small, no rotation)
            // Image[1] (middle, medium, rotated −5°)
            // Image[2] (front-right, large, rotated +2°, anchored bottom-right)
            const rotations = ['0deg', '-5deg', '-10deg'];
            const rightPositions = [0, 20, 30]; // Distance from right edge (negative = extends beyond)
            const bottomPositions = [-10, -20, -30]; // Distance from bottom (adjust to move up/down)
            const widthPercentages = [45, 52, 60]; // Width as % of container
            const zIndexes = [3, 2, 1]; // Front-right on top
            const skewAngles = ['2deg', '4deg', '8deg']; // Slight taper on top edge

            return (
              <View
                key={recipe._id}
                style={[
                  styles.previewImageWrapper,
                  {
                    zIndex: zIndexes[index],
                    right: rightPositions[index],
                    bottom: bottomPositions[index],
                    width: `${widthPercentages[index]}%`,
                    transform: [{ rotate: rotations[index] }, { skewY: skewAngles[index] }],
                  },
                ]}
              >
                {recipe.imageUrl ? (
                  <Image
                    source={{ uri: recipe.imageUrl }}
                    style={styles.previewImage}
                  />
                ) : (
                  <View style={styles.previewImagePlaceholder}>
                    <Ionicons name="restaurant" size={20} color="#6B6866" />
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.logoText}>RecipeAI</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="search" size={24} color="#1A1918" />
          </TouchableOpacity>
          {imageUrl && (
            <TouchableOpacity>
              <Image style={styles.avatar} source={{ uri: imageUrl }} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {!allRecipes || allRecipes.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyStateImageContainer}>
            <View style={styles.emptyStateCard1} />
            <View style={styles.emptyStateCard2} />
          </View>
          <Text style={styles.emptyStateTitle}>
            Add your first{'\n'}recipe to RecipeAI
          </Text>
        </View>
      ) : (
        <FlatList
          data={allCollections}
          renderItem={renderCollectionCard}
          keyExtractor={(item) => item._id}
          numColumns={2}
          style={styles.collectionsList}
          contentContainerStyle={styles.collectionsListContent}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.collectionRow}
        />
      )}

      <TouchableOpacity
        onPress={() => setShowAddModal(true)}
        style={styles.createButton}
      >
        <Ionicons name="add" size={32} color="#FFFEFE" />
      </TouchableOpacity>

      <AddNewModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSelectCollection={() => navigation.navigate("CreateCollectionScreen")}
        onSelectRecipe={() => navigation.navigate("CreateRecipeScreen")}
      />
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
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoText: {
    fontSize: RFValue(20),
    fontFamily: "PPBold",
    color: "#1A1918",
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 20,
  },
  collectionsList: {
    flex: 1,
    paddingTop: 24,
  },
  collectionsListContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  collectionRow: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  collectionCard: {
    width: "48%",
    backgroundColor: "#F8F4F0",
    borderRadius: 20,
    padding: 16,
    minHeight: 180,
    position: "relative",
    overflow: "hidden",
  },
  previewImagesContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    height: "75%",
  },
  previewImageWrapper: {
    position: "absolute",
    bottom: 0,
    height: "95%",
    aspectRatio: 0.75,
    backgroundColor: "#FFFEFE",
    padding: 3,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  previewImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E8E4E0",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCollectionPreview: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  collectionInfo: {
    gap: 4,
    marginBottom: 8,
  },
  collectionName: {
    fontSize: RFValue(16),
    fontFamily: "PPBold",
    color: "#1A1918",
  },
  recipeCount: {
    fontSize: RFValue(13),
    fontFamily: "PPMedium",
    color: "#6B6866",
  },
  emptyState: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 180,
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
  createButton: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 8,
    backgroundColor: "#1A1918",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
});

export default RecipesDashboardScreen;
