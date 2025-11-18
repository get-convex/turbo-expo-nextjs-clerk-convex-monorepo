import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface AddNewModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCollection: () => void;
  onSelectRecipe: () => void;
}

const AddNewModal: React.FC<AddNewModalProps> = ({
  visible,
  onClose,
  onSelectCollection,
  onSelectRecipe,
}) => {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View style={[styles.overlayBackground, { opacity: opacityAnim }]} />
      </Pressable>
      <Animated.View
        style={[
          styles.modalContainer,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>Add New</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#1A1918" />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                onClose();
                onSelectCollection();
              }}
              activeOpacity={0.6}
            >
              <View style={styles.optionImageContainer}>
                <View style={styles.collectionCard1} />
                <View style={styles.collectionCard2} />
              </View>
              <Text style={styles.optionText}>Collection</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                onClose();
                onSelectRecipe();
              }}
              activeOpacity={0.6}
            >
              <View style={styles.optionImageContainer}>
                <View style={styles.recipeCard}>
                  <View style={styles.recipeImagePlaceholder} />
                  <View style={styles.recipeTextLine1} />
                  <View style={styles.recipeTextLine2} />
                </View>
              </View>
              <Text style={styles.optionText}>Recipe</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.extensionPromo}>
            <View style={styles.extensionContent}>
              <View>
                <Text style={styles.extensionTitle}>Setup Extension</Text>
                <Text style={styles.extensionSubtitle}>Save recipes in less tap</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6B6866" />
            </View>
            <View style={styles.extensionIcon}>
              <Ionicons name="restaurant" size={24} color="#F64C20" />
            </View>
          </View>
        </Pressable>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFEFE",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    minHeight: 400,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  title: {
    fontSize: RFValue(22),
    fontFamily: "PPBold",
    color: "#1A1918",
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 32,
    gap: 24,
  },
  option: {
    flex: 1,
    alignItems: "center",
  },
  optionImageContainer: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#F8F4F0",
    borderRadius: 20,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    padding: 20,
  },
  collectionCard1: {
    width: "60%",
    height: "70%",
    backgroundColor: "#E8E0D5",
    borderRadius: 12,
    position: "absolute",
    transform: [{ rotate: "-12deg" }],
    left: "15%",
  },
  collectionCard2: {
    width: "60%",
    height: "70%",
    backgroundColor: "#D4C4B0",
    borderRadius: 12,
    position: "absolute",
    transform: [{ rotate: "8deg" }],
    right: "15%",
  },
  recipeCard: {
    width: "80%",
    height: "85%",
    backgroundColor: "#FFFEFE",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recipeImagePlaceholder: {
    width: "100%",
    height: "50%",
    backgroundColor: "#A8D5A8",
    borderRadius: 8,
    marginBottom: 8,
  },
  recipeTextLine1: {
    width: "80%",
    height: 8,
    backgroundColor: "#E8E4E0",
    borderRadius: 4,
    marginBottom: 6,
  },
  recipeTextLine2: {
    width: "60%",
    height: 8,
    backgroundColor: "#E8E4E0",
    borderRadius: 4,
  },
  optionText: {
    fontSize: RFValue(16),
    fontFamily: "PPBold",
    color: "#1A1918",
  },
  extensionPromo: {
    backgroundColor: "#F8F4F0",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  extensionContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  extensionTitle: {
    fontSize: RFValue(15),
    fontFamily: "PPBold",
    color: "#1A1918",
    marginBottom: 2,
  },
  extensionSubtitle: {
    fontSize: RFValue(13),
    fontFamily: "PPMedium",
    color: "#6B6866",
  },
  extensionIcon: {
    width: 48,
    height: 48,
    backgroundColor: "#FFFEFE",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
});

export default AddNewModal;
