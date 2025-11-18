import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMutation } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";

const CreateCollectionScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("folder");
  const [selectedColor, setSelectedColor] = useState("#F64C20");

  const createCollection = useMutation(api.collections.createCollection);

  const icons = [
    "folder",
    "heart",
    "star",
    "bookmark",
    "pizza",
    "fast-food",
    "restaurant",
    "cafe",
  ];

  const colors = [
    "#F64C20", // Orange
    "#FF6B6B", // Red
    "#4ECDC4", // Teal
    "#95E1D3", // Mint
    "#F38181", // Pink
    "#AA96DA", // Purple
    "#FCBAD3", // Light Pink
    "#A8E6CF", // Green
  ];

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a collection name");
      return;
    }

    try {
      await createCollection({
        name: name.trim(),
        description: description.trim() || undefined,
        icon: selectedIcon,
        color: selectedColor,
      });

      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to create collection");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1A1918" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Collection</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter collection name"
            placeholderTextColor="#A8A5A3"
            autoFocus
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Add a description"
            placeholderTextColor="#A8A5A3"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Icon</Text>
          <View style={styles.iconGrid}>
            {icons.map((icon) => (
              <TouchableOpacity
                key={icon}
                style={[
                  styles.iconOption,
                  selectedIcon === icon && styles.iconOptionSelected,
                  { backgroundColor: selectedIcon === icon ? selectedColor : "#F8F4F0" },
                ]}
                onPress={() => setSelectedIcon(icon)}
              >
                <Ionicons
                  name={icon as any}
                  size={24}
                  color={selectedIcon === icon ? "#FFFEFE" : "#1A1918"}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Color</Text>
          <View style={styles.colorGrid}>
            {colors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.colorOptionSelected,
                ]}
                onPress={() => setSelectedColor(color)}
              >
                {selectedColor === color && (
                  <Ionicons name="checkmark" size={20} color="#FFFEFE" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.preview}>
          <Text style={styles.previewLabel}>Preview</Text>
          <View style={styles.previewCard}>
            <View
              style={[styles.previewIconContainer, { backgroundColor: selectedColor }]}
            >
              <Ionicons name={selectedIcon as any} size={24} color="#FFFEFE" />
            </View>
            <View style={styles.previewContent}>
              <Text style={styles.previewName}>{name || "Collection Name"}</Text>
              {description && (
                <Text style={styles.previewDescription} numberOfLines={2}>
                  {description}
                </Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
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
  saveButton: {
    width: 60,
    alignItems: "flex-end",
  },
  saveButtonText: {
    fontSize: RFValue(16),
    fontFamily: "PPBold",
    color: "#F64C20",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  label: {
    fontSize: RFValue(14),
    fontFamily: "PPBold",
    color: "#1A1918",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#F8F4F0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: RFValue(15),
    fontFamily: "PPMedium",
    color: "#1A1918",
  },
  textArea: {
    minHeight: 80,
    paddingTop: 14,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  iconOption: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  iconOptionSelected: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colorOption: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: "#FFFEFE",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  preview: {
    marginTop: 16,
  },
  previewLabel: {
    fontSize: RFValue(14),
    fontFamily: "PPBold",
    color: "#1A1918",
    marginBottom: 12,
  },
  previewCard: {
    flexDirection: "row",
    backgroundColor: "#F8F4F0",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  previewIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  previewContent: {
    flex: 1,
  },
  previewName: {
    fontSize: RFValue(16),
    fontFamily: "PPBold",
    color: "#1A1918",
    marginBottom: 4,
  },
  previewDescription: {
    fontSize: RFValue(13),
    fontFamily: "PPMedium",
    color: "#6B6866",
    lineHeight: 18,
  },
});

export default CreateCollectionScreen;
