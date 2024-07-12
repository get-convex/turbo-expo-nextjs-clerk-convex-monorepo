import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const { width } = Dimensions.get("window");

export default function InsideNoteScreen({ route, navigation }) {
  const { item } = route.params;
  console.log({ item });
  const [activeTab, setActiveTab] = useState("original"); // State to manage active tab

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/icons/logo2small.png")}
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

        <Text style={styles.title}>{item.title}</Text>
        <TouchableOpacity></TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.contentDescription}>
            {activeTab === "original"
              ? item.content
              : item.summary
                ? item.summary
                : "No summary available"}
          </Text>
        </View>
      </ScrollView>

      {/* Sticky footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.footerTab,
            activeTab === "original" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("original")}
        >
          <Image
            source={require("../assets/icons/OrignalIcon.png")} // Replace with your original icon image file
            style={[
              styles.footerIcon,
              activeTab === "original"
                ? styles.activeIcon
                : styles.inactiveIcon,
            ]}
          />
          <Text
            style={[
              styles.footerText,
              activeTab === "original"
                ? styles.activeTabText
                : styles.inactiveTabText,
            ]}
          >
            Original
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.footerTab,
            activeTab === "summary" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("summary")}
        >
          <Image
            source={require("../assets/icons/summaryIcon.png")} // Replace with your summary icon image file
            style={[
              styles.footerIcon,
              activeTab === "summary" ? styles.activeIcon : styles.inactiveIcon,
            ]}
          />
          <Text
            style={[
              styles.footerText,
              activeTab === "summary"
                ? styles.activeTabText
                : styles.inactiveTabText,
            ]}
          >
            Summary
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FE",
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
  contentContainer: {
    // Add styles for contentContainer if needed
  },
  contentTitle: {
    fontSize: RFValue(17.5),
    fontFamily: "MMedium",
    color: "#000",
    textAlign: "center",
    marginTop: 28,
  },
  contentDescription: {
    fontSize: RFValue(17.5),
    fontFamily: "MRegular",
    alignSelf: "center",
    textAlign: "justify",
    paddingLeft: 29,
    paddingRight: 21,
    marginTop: 30,
  },
  footer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#D9D9D9",
  },
  footerTab: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  footerIcon: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
  activeTab: {
    backgroundColor: "#0D87E1",
  },
  activeIcon: {
    tintColor: "#fff",
  },
  inactiveIcon: {
    tintColor: "#000",
  },
  footerText: {
    fontSize: RFValue(12.5),
    fontFamily: "MRegular",
  },
  activeTabText: {
    color: "#fff",
  },
  inactiveTabText: {
    color: "#000",
  },
});
