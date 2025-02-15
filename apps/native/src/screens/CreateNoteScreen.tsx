import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Animated,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { AntDesign } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { api } from "@packages/backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";

const { width } = Dimensions.get("window");

export default function CreateNoteScreen({ navigation }) {
  const createNote = useMutation(api.notes.createNote);
  const openaiKeySet = useQuery(api.openai.openaiKeySet) ?? true;

  const [isAdvancedSummarizationEnabled, setIsAdvancedSummarizationEnabled] =
    useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const footerY = new Animated.Value(0);
  const toggleAdvancedSummarization = () => {
    setIsAdvancedSummarizationEnabled(!isAdvancedSummarizationEnabled);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        // Slide down the footer
        Animated.timing(footerY, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        // Slide up the footer
        Animated.timing(footerY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      },
    );

    // Clean up function
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Calculate the position of the footer based on the Animated.Value
  const footerTranslateY = footerY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100], // Adjust this range according to the height of your footer
  });

  const createUserNote = async () => {
    await createNote({
      title: noteTitle,
      content: noteContent,
      isSummary: isAdvancedSummarizationEnabled,
    });
    navigation.navigate("NotesDashboardScreen");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/icons/logo2small.png")} // Replace with your logo image file
          style={styles.logo}
        />
      </View>

      <View style={styles.underHeaderContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={styles.arrowBack}
            source={require("../assets/icons/arrow-back.png")}
          />
        </TouchableOpacity>

        <Text style={styles.title}>Create a New Note</Text>
        <TouchableOpacity>
          <Image
            style={styles.arrowBack}
            source={require("../assets/icons/saveIcon.png")}
          />
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Title</Text>
          <TextInput
            value={noteTitle}
            onChangeText={(val: string) => setNoteTitle(val)}
            style={styles.inputField}
            placeholder="Note Title"
            placeholderTextColor="#A9A9A9"
          />
          <Text style={styles.inputLabel}>Content</Text>
          <TextInput
            value={noteContent}
            onChangeText={(val: string) => setNoteContent(val)}
            style={[styles.inputField, styles.inputFieldMulti]}
            multiline
            placeholder="Note Comments"
            placeholderTextColor="#A9A9A9"
          />
        </View>
        <Text
          style={{ ...styles.inputLabel, paddingHorizontal: 27, marginTop: 10 }}
        >
          AI Features
        </Text>

        {/* Advanced Summarization Section */}
        <View style={styles.advancedSummarizationContainer}>
          <View style={styles.advancedSummarizationCheckboxContainer}>
            <TouchableOpacity
              onPress={toggleAdvancedSummarization}
              style={openaiKeySet ? styles.checkbox : styles.checkboxDisabled}
              disabled={!openaiKeySet}
            >
              {isAdvancedSummarizationEnabled && (
                <AntDesign
                  name="check"
                  size={RFValue(12.5)}
                  color="#0D87E1"
                  aria-checked
                />
              )}
            </TouchableOpacity>
            <Text style={styles.advancedSummarizationText}>
              Advanced Summarization {openaiKeySet ? "" : " (Disabled)"}
            </Text>
          </View>
          <Text style={styles.advancedSummarizationSubtext}>
            {openaiKeySet
              ? "Check this box if you want to generate summaries using AI."
              : "Please set OPENAI_API_KEY in your environment variables."}
          </Text>
        </View>
      </KeyboardAwareScrollView>
      <Animated.View
        style={[
          styles.newNoteButtonContainer,
          { transform: [{ translateY: footerTranslateY }] },
        ]}
      >
        <TouchableOpacity onPress={createUserNote} style={styles.newNoteButton}>
          <AntDesign name="pluscircle" size={20} color="#fff" />
          <Text style={styles.newNoteButtonText}>Create a New Note</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#0D87E1",
    height: 67,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 46,
    height: 46,
    borderRadius: 20,
    resizeMode: "contain",
  },
  underHeaderContainer: {
    width: width,
    height: 62,
    backgroundColor: "#fff",
    borderBottomWidth: 2,
    borderBottomColor: "#D9D9D9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  arrowBack: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: RFValue(17.5),
    fontFamily: "MMedium",
    color: "#2D2D2D",
  },
  inputContainer: {
    paddingHorizontal: 27,
    marginTop: 43,
  },
  inputLabel: {
    fontSize: RFValue(15),
    fontFamily: "MMedium",
    color: "#000",
    marginBottom: 6,
  },
  inputField: {
    backgroundColor: "#FFF",
    marginBottom: 30,
    fontSize: RFValue(15),
    fontFamily: "MLight",
    color: "#000",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12.5,
    borderWidth: 1,
    borderColor: "#D9D9D9",
  },
  inputFieldMulti: {
    minHeight: 228,
    textAlignVertical: "top",
    paddingTop: 10,
  },
  advancedSummarizationContainer: {
    paddingHorizontal: 27,
    marginTop: 10,
  },
  advancedSummarizationCheckboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkbox: {
    width: RFValue(17.5),
    height: RFValue(17.5),
    borderRadius: RFValue(5),
    borderWidth: 1,
    borderColor: "#0D87E1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: RFValue(10),
    backgroundColor: "#F9F5FF",
  },
  checkboxDisabled: {
    width: RFValue(17.5),
    height: RFValue(17.5),
    borderRadius: RFValue(5),
    borderWidth: 1,
    borderColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: RFValue(10),
    backgroundColor: "#F9F5FF",
  },
  advancedSummarizationText: {
    fontSize: RFValue(15),
    fontFamily: "MLight",
    color: "#000",
  },
  advancedSummarizationSubtext: {
    fontSize: RFValue(12.5),
    fontFamily: "MRegular",
    color: "#A9A9A9",
    paddingHorizontal: 30,
  },
  newNoteButton: {
    flexDirection: "row",
    backgroundColor: "#0D87E1",
    borderRadius: 7,
    width: width / 1.6,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    position: "absolute",
    bottom: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  newNoteButtonText: {
    color: "white",
    fontSize: RFValue(15),
    fontFamily: "MMedium",
    marginLeft: 10,
  },
  newNoteButtonContainer: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    // ... other styles you need
  },
});
